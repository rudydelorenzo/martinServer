<%-- 
    Document   : index
    Created on : 25-Apr-2020, 1:27:38 PM
    Author     : rudydelorenzo
--%>

<%@page import="java.util.Date"%>
<%@page import="java.util.ArrayList"%>
<%@page import="martinBMW.*"%>
<%@page import="martinBMW.Part"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>martinBMW - Results</title>
    </head>
    <%
        martinBMW m = new martinBMW();
        ArrayList<Part> parts = m.getParts("https://gist.githubusercontent.com/rudydelorenzo/33e8db417e81232e7f12c4ed5e639b83/raw");
        
        String zip = "T5K2K3";
        int distance = 500;
        String URL = String.format("https://www.picknpull.com/check_inventory.aspx?Zip=%s&Make=90&Model=&Year=&Distance=%d", zip, distance);
        
        ArrayList<Car> newCars = m.getNewCars(URL);
        if (!newCars.isEmpty()) {
            System.out.printf("(%tH:%<tM:%<tS) STARTING IN-DEPTH SCAN%n", new Date());
            for (Car c : newCars) c.calculateRelevance(parts, "E39");
            newCars = m.sortList(newCars);
        } else {
            System.out.println("NO CARS FOUND");
        }
    %>
    <body>
        <h1>Hello World!</h1>
        <h2>Length of newCars = <%=newCars.size()%></h2>
        <h2>First car found is a <%=newCars.get(0)%><h2>
        <%
            parts = null;
            newCars = null;
        %>
    </body>
</html>
