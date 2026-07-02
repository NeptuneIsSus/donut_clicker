let hoverSFX = document.querySelector(".hover-sfx");
let openSFX = document.querySelector(".open-sfx");
let closeSFX = document.querySelector(".close-sfx");
let loadMenu
let settMenu

function btnHover() {
    hoverSFX.currentTime = 0;
    hoverSFX.play();
}

function openNew() {
    openSFX.currentTime = 0;
    openSFX.play();
}

function openLoad() {
    //loadMenu.classList.remove("closed")

    openSFX.currentTime = 0;
    openSFX.play();
}

function openSettings() {
    //settMenu.classList.remove("closed")

    openSFX.currentTime = 0;
    openSFX.play();
}

function closeMenu() {
    /*loadMenu.classList.add("closed")
    settMenu.classList.add("closed")

    closeSFX.currentTime = 0;
    closeSFX.play();*/
}