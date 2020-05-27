<%-- 
    Document   : index
    Created on : 25-Apr-2020, 1:27:38 PM
    Author     : rudydelorenzo
--%>

<%@page import="java.io.IOException"%>
<%@page import="java.awt.Color"%>
<%@page import="java.awt.Graphics2D"%>
<%@page import="java.awt.Image"%>
<%@page import="javax.imageio.ImageIO"%>
<%@page import="java.net.URL"%>
<%@page import="java.awt.image.BufferedImage"%>
<%@page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="martinBMW.*"%>
<%@page import="martinBMW.Part"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta charset="UTF-8">
        <meta name="viewport" content="width = device-width, initial-scale = 1.0">
        <meta http-equiv="X-UA-Compatible" content = "ie=edge">
        <link rel="stylesheet" type="text/css" href="search.css">
        <link rel="icon" type="image/png" href="graphics/logo.png">
        <script src="searchScripts.js"></script>
        <title>martinBMW - Results</title>
    </head>
    <body>
        <div id='loadingContainer'>
            <div id='loadingDiv'>
                <h1>Searching...</h1>
                <progress id='progBar' max='100' value="0">0%</progress>
                <div class='progUpdateContainer'>
                    <div class="loader"></div>
                    <p>Running part number lookup...</p>
                </div>
            </div>
        </div>
        <%!
            public String updateProgress(float prog) {
                return "<script>document.getElementById('progBar').value = " + prog + ";</script>";
            }

            public String addStage(String stageText) {
                String script = "<script>addStage('" + stageText + "')</script>";
                return script;
            }

            public int getAverage(Color c) {
                int total = 0;
                total += c.getBlue();
                total += c.getGreen();
                total += c.getRed();

                return total/3;
            }

            public boolean isUpright(String url) {
                try {
                    BufferedImage img = ImageIO.read(new URL(url));

                    int smallHeight = 6;

                    Image tmp = img.getScaledInstance(1, smallHeight, Image.SCALE_DEFAULT);
                    BufferedImage small = new BufferedImage(1, smallHeight, BufferedImage.TYPE_INT_RGB);

                    Graphics2D g2d = small.createGraphics();
                    g2d.drawImage(tmp, 0, 0, null);
                    g2d.dispose();

                    int topBrightness = getAverage(new Color(small.getRGB(0, 0)));
                    int bottomBrightness = getAverage(new Color(small.getRGB(0, smallHeight-1)));
                    int diff = topBrightness - bottomBrightness;

                    return !(diff < -10);
                } catch (IOException e) {
                    return true;
                }
            }
        %>
        
        <%
            out.flush();
            
            //set up all the variables
            String generation = request.getParameter("generation");
            String zip = request.getParameter("postCode").replace(" ", "");;
            int distance = Integer.parseInt(request.getParameter("distance"));
            String textList = request.getParameter("textList");
            String listLink = request.getParameter("listLink");
            float progress = 0;

            martinBMW m = new martinBMW();

            ArrayList<Part> parts;
            if (!textList.equals("")) {
                parts = m.getParts(textList);
            } else {
                parts = m.getParts(m.getTextFromURL(listLink));
            }


            String URL = String.format("https://www.picknpull.com/check_inventory.aspx?Zip=%s&Make=90&Model=&Year=&Distance=%d", zip, distance);
            
            progress = 10;
            out.write(updateProgress(progress));
            out.write(addStage("Searching for cars..."));
            out.flush();

            ArrayList<Car> newCars = new ArrayList();

            try {
                newCars = m.getNewCars(URL);
                progress = 25;
                out.write(updateProgress(progress));
                out.write(addStage("Looking up car details..."));
                out.flush();
                if (!newCars.isEmpty()) {
                    System.out.printf("(%tH:%<tM:%<tS) STARTING IN-DEPTH SCAN%n", new Date());
                    for (Car c : newCars) {
                        c.upright = isUpright(c.thumbnailURL);
                        c.calculateRelevance(parts, generation);
                        progress += (75.00/(float)newCars.size());
                        out.write(updateProgress(progress));
                        out.flush();
                    }
                    newCars = m.sortList(newCars);
                    System.out.printf("(%tH:%<tM:%<tS) THERE ARE %d NEW CARS!%n%n", new Date(), newCars.size());
                } else {
                    progress = 100;
                    out.write(updateProgress(progress));
                    out.flush();
                    System.out.println("NO CARS FOUND");
                }
            } catch (CouldNotConnectException e) {
                //TODO: Couldn't connect to picknpull, have to handle.
            }
            out.write(addStage("Done!"));
            out.write("<script>"
                    + "var element = document.getElementById('loadingContainer');"
                    + "element.parentNode.removeChild(element);"
                    + "</script>");
        %>
        <c:choose>
            <c:when test="${!newCars.isEmpty()}">
                <div class="imageContainer">
                    <img src="graphics/searchGraphics/text.png" id="logo">
                </div>
                
                <div style="text-align: center; width: 100%;">
                    <div class="relevanceSelector">
                        <button class="buttonUnselected" onclick="showRelevance('identical')" id="identicalButton">IDENTICAL</button>
                        <button class="buttonUnselected" onclick="showRelevance('partial')" id="partialButton">PARTIAL</button>
                        <button class="buttonUnselected" onclick="showRelevance('other')" id="otherButton">OTHER</button>
                        <button class="buttonUnselected" onclick="showAll()" id="allButton">ALL</button>
                    </div>
                </div>
                
                
                <div id="identicalContainer">
                    <h3>Vehicles from the <%=generation%> generation</h3>
                    <div class="scrollingContainer">
                    <%
                        for (Car c : newCars) {
                            if (c.relevance == Relevance.IDENTICAL) {
                                out.write(String.format("<a class='cardLink' href='%s'> <div class='card'>"
                                        + "<img %s src='" + c.imageURL + "'>"
                                        + "<p class='title'>%d %s</p>"
                                        + "<p class='subtitle'>%s   (%s)</p>"
                                        + "<p class='location'><strong>%s</strong> | Row %d</p>"
                                        + "<p class='vin'>VIN: %s</p>"
                                        + "</div></a>", c.carURL, c.upright ? "":"class=\"rotatedImage\"", 
                                        c.year, c.model.replace("-", " "), c.trim, c.generation, c.locationName, c.row, c.vin));
                            }
                        }
                    %>
                    </div>
                </div>
                <div id="partialContainer">
                    <h3>Vehicles that may contain parts you're looking for</h3>
                    <div class="scrollingContainer">
                    <%
                        for (Car c : newCars) {
                            if (c.relevance == Relevance.PARTIAL) {
                                out.write(String.format("<a class='cardLink' href='%s'> <div class='card'>"
                                        + "<img %s src='" + c.imageURL + "'>"
                                        + "<p class='title'>%d %s</p>"
                                        + "<p class='subtitle'>%s   (%s)</p>"
                                        + "<p class='location'><strong>%s</strong> | Row %d</p>"
                                        + "%s"
                                        + "<p class='vin'>VIN: %s</p>"
                                        + "</div></a>", c.carURL, c.upright ? "":"class=\"rotatedImage\"", 
                                        c.year, c.model.replace("-", " "), c.trim, c.generation, c.locationName, c.row, c.getPartsListHTML(), c.vin));
                            }
                        }
                    %>
                    </div>
                </div>
                <div id="otherContainer">
                    <h3>Other vehicles that are most likely irrelevant to your search</h3>
                    <div class="scrollingContainer">
                    <%
                        for (Car c : newCars) {
                            if (c.relevance == Relevance.NONE) {
                                out.write(String.format("<a class='cardLink' href='%s'> <div class='card'>"
                                        + "<p class='title'>%d %s</p>"
                                        + "<p class='subtitle'>Generation: %s</p>"
                                        + "<p class='location'><strong>%s</strong> | Row %d</p>"
                                        + "<p class='vin'>VIN: %s</p>"
                                        + "</div></a>", c.carURL, c.year, c.model.replace("-", " "), c.generation, c.locationName, c.row, c.vin));
                            }
                        }
                    %>
                    </div>
                </div>
                
                <script>showAll();</script>
                <script>enableDragging();</script>
            </c:when>    
            <c:otherwise>
                <h2>Connection couldn't be established or no BMWs are present in any nearby locations.</h2>
            </c:otherwise>
        </c:choose>
    </body>
</html>
