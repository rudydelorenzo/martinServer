function addStage(stageText) {
    //complete previous status
    var ld = document.getElementById("loadingDiv");
    var lastUpdate = ld.lastElementChild;

    var e = document.createElement("img");
    e.setAttribute("class", "checkMark");
    e.setAttribute("src", "graphics/resultsGraphics/checkmark.png");

    lastUpdate.replaceChild(e, lastUpdate.children[0]);

    //add new status
    var newStage = document.createElement("div");
    newStage.setAttribute("class", "progUpdateContainer");

    var spinner = document.createElement("div");
    spinner.setAttribute("class", "loader");

    var text = document.createElement("p");
    text.innerHTML = stageText;

    newStage.appendChild(spinner);
    newStage.appendChild(text);

    ld.appendChild(newStage);
}

function makeDraggable(sliderElement) {
    var slider = sliderElement;
    var isDown = false;
    var enableClick = true;
    var startX;
    var scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        e.preventDefault();
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', (e) => {
        isDown = false;
    });
    slider.addEventListener('mouseup', (e) => {
        isDown = false;
    });
    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        enableClick = false;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
    });
    slider.addEventListener('click', (e) => {
        if (!enableClick) {
            e.preventDefault();
            enableClick = true;
        }
    });
}

function enableDragging() {
    c = document.getElementsByClassName("scrollingContainer");
    for (i = 0; i<c.length; i++) {
        makeDraggable(c[i]);
    }
}

function unselectAllButtons() {
    buttons = document.getElementsByClassName("relevanceSelector")[0].children;
    for (i = 0; i < buttons.length; i++) {
        if (buttons[i].tagName == "BUTTON") {
            buttons[i].className = "buttonUnselected"
        }
    }
}

function showAll() {
    document.getElementById("identicalContainer").style.display = "block";
    document.getElementById("partialContainer").style.display = "block";
    document.getElementById("otherContainer").style.display = "block";
    unselectAllButtons();
    document.getElementById("allButton").className = "buttonSelected";
}

function hideAll() {
    document.getElementById("identicalContainer").style.display = "none";
    document.getElementById("partialContainer").style.display = "none";
    document.getElementById("otherContainer").style.display = "none";
    
}

function showRelevance(r) {
    hideAll();
    unselectAllButtons();
    clickedButton = document.getElementById(r.concat("Button"));
    clickedButton.className = "buttonSelected";
    relevanceDiv = document.getElementById(r.concat("Container"));
    relevanceDiv.style.display = "block";
}