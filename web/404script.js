document.getElementsByClassName("button-goback")[0].addEventListener("click", function(e) {
    window.history.back();
});

document.getElementsByClassName("button-home")[0].addEventListener("click", function(e) {
    window.location = "/";
});