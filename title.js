let hoverSFX = document.querySelector(".hover-sfx");
let openSFX = document.querySelector(".open-sfx");
let closeSFX = document.querySelector(".close-sfx");
let loadMenu = document.getElementById("loadBox")
let settMenu = document.getElementById("settBox")

function btnHover() {
    hoverSFX.currentTime = 0;
    hoverSFX.play();
}

function openLoad() {
    loadMenu.classList.add("active")

    openSFX.currentTime = 0;
    openSFX.play();
}

function openSettings() {
    settMenu.classList.add("active")

    openSFX.currentTime = 0;
    openSFX.play();
}

function closeMenu() {
    loadMenu.classList.remove("active")
    settMenu.classList.remove("active")

    closeSFX.currentTime = 0;
    closeSFX.play();
}

function quit() {
    if (window.IS_PYWEBVIEW === false) {
        window.close()
    } else {
        window.pywebview.api.kill()
    }
}

function newGame() {
    window.location.href = "clicker.html"
}



async function startup() {
    await window.pywebview.api.get_save_list(false)
}

window.addEventListener("pywebviewready", startup)