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
            buttons[i].className = "buttonUnselected";
        }
    }
}

function showAll() {
    hideAll();
    document.getElementById("identicalContainer").classList.remove("hide");
    document.getElementById("partialContainer").classList.remove("hide");
    document.getElementById("otherContainer").classList.remove("hide");
    unselectAllButtons();
    document.getElementById("allButton").className = "buttonSelected";
}

function hideAll() {
    document.getElementById("identicalContainer").classList.add("hide");
    document.getElementById("identicalContainer").childNodes[3].classList.remove("fullscreen");
    document.getElementById("partialContainer").classList.add("hide");
    document.getElementById("partialContainer").childNodes[3].classList.remove("fullscreen");
    document.getElementById("otherContainer").classList.add("hide");
    document.getElementById("otherContainer").childNodes[3].classList.remove("fullscreen");
    
}

function showRelevance(r) {
    hideAll();
    unselectAllButtons();
    clickedButton = document.getElementById(r.concat("Button"));
    clickedButton.className = "buttonSelected";
    relevanceDiv = document.getElementById(r.concat("Container"));
    relevanceDiv.classList.remove("hide"); 
    relevanceDiv.childNodes[3].classList.add("fullscreen");
}

function setNumbers(i, p, o) {
    total = i+p+o;
    allbutton = document.getElementById("allButton");
    allbutton.innerHTML = allbutton.innerHTML.concat(" (").concat(total).concat(")")
    ident = document.getElementById("identicalButton");
    ident.innerHTML = ident.innerHTML.concat(" (").concat(i).concat(")")
    part = document.getElementById("partialButton");
    part.innerHTML = part.innerHTML.concat(" (").concat(p).concat(")")
    other = document.getElementById("otherButton");
    other.innerHTML = other.innerHTML.concat(" (").concat(o).concat(")")
}

function assignErrorListeners() {
    if ((!!document.getElementsByClassName("error-go-back")[0])) {
        document.getElementsByClassName("error-go-back")[0].addEventListener("click", function() {
            window.history.back();
        });
    }
    document.getElementsByClassName("error-help")[0].addEventListener("click", function() {
        window.location = "/help.html";
    });
}

function assignResultsListeners() {
    document.getElementById("logo").addEventListener("click", function(e) {
        window.location = "/";
    });
}

function isInView(e) {
    var box = e;
    var rect = box.getBoundingClientRect();

    var isInViewport = rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    return isInViewport;
}