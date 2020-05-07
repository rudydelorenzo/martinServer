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
    var startX;
    var scrollLeft;

    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
      isDown = false;
    });
    slider.addEventListener('mouseup', () => {
      isDown = false;
    });
    slider.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 3; //scroll-fast
      slider.scrollLeft = scrollLeft - walk;
    });
    slider.addEventListener('click', (e) => {
      e.preventDefault();
    });
}

function enableDragging() {
    c = document.getElementsByClassName("scrollingContainer");
    for (i = 0; i<c.length; i++) {
        makeDraggable(c[i]);
    }
}