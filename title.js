let hoverSFX = document.querySelector(".hover-sfx");
let openSFX = document.querySelector(".open-sfx");
let closeSFX = document.querySelector(".close-sfx");
let startSFX = document.querySelector(".start-sfx");

let loadMenu = document.getElementById("loadBox");
let settMenu = document.getElementById("settBox");

let saveOG = document.querySelector(".save");
let saveList = document.querySelector(".load-arrange")



function toTitleCase(str) {
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

function btnHover() {
    hoverSFX.currentTime = 0;
    hoverSFX.play();
}

function openLoad() {
    loadMenu.classList.add("active");

    openSFX.currentTime = 0;
    openSFX.play();
}

function openSettings() {
    settMenu.classList.add("active");

    openSFX.currentTime = 0;
    openSFX.play();
}

function closeMenu() {
    loadMenu.classList.remove("active");
    settMenu.classList.remove("active");

    closeSFX.currentTime = 0;
    closeSFX.play();
}

function quit() {
    if (window.IS_PYWEBVIEW === false) {
        window.close();
    } else {
        window.pywebview.api.kill();
    };
}

function newGame() {
    window.location.href = "clicker.html";
}

function loadGame(event) {
    const saveID = event.currentTarget.dataset.id;
    const encoded = encodeURIComponent(saveID);
    const location = `clicker.html?save=${encoded}`;
    startSFX.currentTime = 0;
    startSFX.play();
    console.log(saveID,location);
    window.location.href = location;
}

async function addSave(saveID) {
    console.log("Fetching Save:",saveID);

    const savedata = await window.pywebview.api.load_game("general", saveID)

    let dupe = saveOG.cloneNode(true);
    dupe.classList.remove("disabled");

    dupe.dataset.id = saveID;

    dupe.querySelector(".save-name").innerHTML = toTitleCase(saveID);
    dupe.querySelector(".save-prestige").src = `assets/img/ui/die${savedata["prestige"]}.svg`;
    dupe.querySelector(".save-donut").innerHTML = savedata["currentDonut"];
    dupe.querySelector(".save-progress").innerHTML = savedata["progress"];
    dupe.querySelector(".save-time-p").innerHTML = savedata["prestige_timer"];
    dupe.querySelector(".save-time-g").innerHTML = savedata["global_timer"];
    dupe.querySelector(".save-achievements").innerHTML = savedata["achievements"].length;

    dupe.addEventListener("click", loadGame);

    saveList.appendChild(dupe);
}

async function setupSaves() {
    const save_list = await window.pywebview.api.get_save_list(true);
    console.log(save_list);

    for (let i in save_list) {
        await addSave(save_list[i]);
    };
}



async function startup() {
    await setupSaves();
}

window.addEventListener("pywebviewready", startup);