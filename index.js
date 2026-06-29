let donutElement = document.querySelector(".donut");;
let donutSprite = document.querySelector(".donut img");
let x;
let y;

donutRandomPosition();
let clickSFX = document.querySelector(".click-sfx");

let energy = 0n;
let energyElement = document.querySelector(".energy-text");

let currentDonut = 0;
let nextDonutPrice = 25n;
let nextDonutPriceTag = document.getElementById("donutPriceTag");
let nextDonutSprite = document.querySelector(".donut-image img");
let nextDonutNumber = document.getElementById("donutNumber");
let nextDonutName = document.querySelector(".donut-info h2");
let nextDonutDescription = document.querySelector(".donut-image p");
let donutPurchase = document.querySelector(".donut-info button");

let openMenuSFX = document.querySelector(".open-menu-sfx");
let closeMenuSFX = document.querySelector(".close-menu-sfx");

let buySFX = document.querySelector(".buy-sfx");
let poorSFX = document.querySelector(".poor-sfx");
let hoverSFX = document.querySelector(".hover-sfx")

let devMode = false;
let devButton = document.querySelector(".dev-mode");

let originalUpgrade = document.querySelector(".upgrade");
let upgrid = document.querySelector(".upgrid");
const levelTypes = ["I","II","III","IV","V"];

let upgradeName = document.querySelector(".upgrade-name");
let upgradePrice = document.querySelector(".upgrade-price");
let upgradeLevel = document.querySelector(".upgrade-level");
let upgradeDescription = document.querySelector(".upgrade-description");

let mouseDown = false;

let upgradeOwned = {}
let upgradeUnlocked = [0,1,2,4,8,11]
let upgradeStat = {
    "clickType": 0, // 1 hold down mouse, 2 no click required
    "doubleChance": 0.0, // 0.0-1.0 double clicks, 1.0-2.0 triple clicks
    "homesickChance": 0.0, // 0.0-1.0 close chance, 1.0-2.0 rock chance
    "stormCharge": 100,
    "stormClicks": 0,
    "diceChance": 1,
    "diceClickChance": 0.0,
    "donutSale": 1.0
};

const DirDonutSprites = "assets/img/donuts/"

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
};

function suffix(value, zeros, suffix ,prefix) {
    const compare = 1000n ** BigInt(zeros);

    const scaled = (value * 100n) / compare;
    const str = scaled.toString();

    const whole = str.length > 2 ? str.slice(0,-2) : "0";
    const decimal = str.length > 2 ? str.slice(-2) : str.padStart(2, "0");
    const trimmedDecimal = decimal.replace(/0+$/, "");

    return (
        prefix +
        whole +
        (trimmedDecimal ? "." + trimmedDecimal : "") +
        suffix
    );
};

function formatNumber(text) {
    const num = BigInt(text);
    const neg = num < 0n;
    const prefix = neg ? "-" : "";
    const absolute = neg ? -num : num;

    if (absolute >= 1_000_000_000_000_000_000_000_000_000_000_000n) {return suffix(absolute,11,"d",prefix)};
    if (absolute >= 1_000_000_000_000_000_000_000_000_000_000n) {return suffix(absolute,10,"n",prefix)};
    if (absolute >= 1_000_000_000_000_000_000_000_000_000n) {return suffix(absolute,9,"o",prefix)};
    if (absolute >= 1_000_000_000_000_000_000_000_000n) {return suffix(absolute,8,"S",prefix)};
    if (absolute >= 1_000_000_000_000_000_000_000n) {return suffix(absolute,7,"s",prefix)};
    if (absolute >= 1_000_000_000_000_000_000n) {return suffix(absolute,6,"Q",prefix)};
    if (absolute >= 1_000_000_000_000_000n) {return suffix(absolute,5,"q",prefix)};
    if (absolute >= 1_000_000_000_000n) {return suffix(absolute,4,"t",prefix)};
    if (absolute >= 1_000_000_000n) {return suffix(absolute,3,"b",prefix)};
    if (absolute >= 1_000_000n) {return suffix(absolute,2,"m",prefix)};
    if (absolute >= 1_000n) {return suffix(absolute,1,"k",prefix)};

    return prefix + absolute.toString();
};

function addUpgrade(data,id) {
    const background = `assets/img/upgrade templates/${data["tier"]}.svg`;
    const foreground = `assets/img/upgrade/${data["file"]}.svg`;
    let level = "";

    if (data["levels"] > 1) {
        level = levelTypes[0]
    }

    let duplicateUpgrade = originalUpgrade.cloneNode(true);
    duplicateUpgrade.classList.remove("disabled");

    let dupeBG = duplicateUpgrade.querySelector(".upgrade-bg");
    let dupeFG = duplicateUpgrade.querySelector(".upgrade-fg");
    let dupeLV = duplicateUpgrade.querySelector("p");

    dupeBG.src = background;
    dupeFG.src = foreground;
    dupeLV.innerHTML = level;

    duplicateUpgrade.dataset.name = data["name"]
    duplicateUpgrade.dataset.price = data["prices"][0]
    duplicateUpgrade.dataset.description = data["description"]
    duplicateUpgrade.dataset.level = level
    duplicateUpgrade.dataset.var = data["var"]
    duplicateUpgrade.dataset.value = data["value"]
    duplicateUpgrade.dataset.change = data["change"]
    duplicateUpgrade.dataset.id = id

    duplicateUpgrade.addEventListener("mouseenter", upgradeHover);
    duplicateUpgrade.addEventListener("click", upgradeClick);

    upgrid.appendChild(duplicateUpgrade);
};

function updateCounter() {
    energyElement.innerHTML = formatNumber(energy)

    const holdDuration = energyElement.style.transitionDuration
    const holdFontSize = energyElement.style.fontSize

    energyElement.style.transitionDuration = "0s"
    energyElement.style.fontSize = "150px"
    energyElement.offsetHeight;

    energyElement.style.transitionDuration = holdDuration
    energyElement.style.fontSize = holdFontSize
};

function updateDonut() {
    const nextDonut = currentDonut + 1;

    nextDonutNumber.innerHTML = nextDonut + 1;
    nextDonutPriceTag.innerHTML = formatNumber(nextDonutPrice);

    fetch("donuts.json")
        .then(response => response.json())
        .then(data => {
            const curSprite = data[currentDonut]["file"]
            const nxtSprite = data[nextDonut]["file"]
            const nxtName = data[nextDonut]["name"]
            const nxtDesc = data[nextDonut]["description"]
            const nxtFont = data[nextDonut]["font"]
            const nxtFormalFont = `opt${nxtFont}, sans-serif`

            //console.log("Donut font:",nxtFont,", Full font:", nxtFormalFont)

            donutSprite.src = DirDonutSprites + curSprite + ".svg";
            nextDonutSprite.src = DirDonutSprites + nxtSprite + ".svg";
            nextDonutName.textContent = nxtName;
            nextDonutName.style.fontFamily = nxtFormalFont
            nextDonutDescription.textContent = nxtDesc;

            let tmpSize = 100;
            nextDonutName.style.fontSize = `${tmpSize}px`;

            while ((nextDonutName.scrollWidth > nextDonutName.clientWidth ||
                nextDonutName.scrollHeight > nextDonutName.clientHeight) && tmpSize > 1) {
                tmpSize -= 5;
                nextDonutName.style.fontSize = `${tmpSize}px`;
            };
        }).catch(err => console.error(err));
};

function updateUpgrades() {
    /*for (let e in document.querySelectorAll(".upgrade")) {
        if (!e.classList.contains("disabled")) {
            e.remove()
        };
    };*/

    fetch("upgrades.json")
        .then(response => response.json())
        .then(data => {
            for (let i of upgradeUnlocked) {
                addUpgrade(data[i],i)
            };
        }).catch(err => console.error(err));
};

function closeMenu(menu) {
    const menuColor = document.querySelector(`div.${menu}`);
    const menuParent = menuColor.parentElement;
    menuParent.classList.remove("active");
};

function donutRandomPosition() {
    const offsetWidth = donutSprite.width / 2
    const offsetHeight = donutSprite.height / 2

    x = Math.random() * (window.innerWidth - offsetWidth);
    y = Math.random() * (window.innerHeight - offsetHeight);

    const clampX = offsetWidth * 3
    const clampY = offsetHeight * 3

    x = clamp(x, clampX, window.innerWidth - clampX)
    y = clamp(y, clampY, window.innerHeight - clampY)

    donutElement.style.left = `${x}px`;
    donutElement.style.top = `${y}px`;
};

function clickDonut() {
    donutRandomPosition()
    
    energy += BigInt(currentDonut + 1)

    updateCounter()

    clickSFX.currentTime = 0;
    clickSFX.play();
};

document.querySelectorAll(".menus button").forEach(btn => {
    btn.addEventListener("click", () => {
        openMenuSFX.currentTime = 0;
        openMenuSFX.play();
        
        const btnCode = [...btn.classList].find(className => className.endsWith("Coded"));
        const btnMenuColor = document.querySelector(`div.${btnCode}`);
        const btnMenu = btnMenuColor.parentElement;
        btnMenu.classList.add("active");

        updateDonut()
    });
});

document.querySelectorAll(".menu-return").forEach(btn => {
    btn.addEventListener("click", () => {
        closeMenuSFX.currentTime = 0;
        closeMenuSFX.play();

        const btnCode = [...btn.classList].find(className => className.endsWith("Coded"));
        closeMenu(btnCode)
    });
});

function buyNextDonut() {
    updateDonut()
    if (energy >= nextDonutPrice || devMode) {
        buySFX.currentTime = 0;
        buySFX.play();

        energy -= nextDonutPrice;
        nextDonutPrice = (nextDonutPrice * 1459n) / 1000n;
        currentDonut ++;

        updateCounter();
        updateDonut();

        if (!devMode) {closeMenu("donutCoded")};
    } else {
        poorSFX.currentTime = 0
        poorSFX.play()
    };
};

function toggleDevMode() {
    devButton.classList.toggle("active");
    devMode = devButton.classList.contains("active");
    console.log(devMode);
    if (devMode) {
        openMenuSFX.currentTime = 0;
        openMenuSFX.play()
    } else {
        closeMenuSFX.currentTime = 0;
        closeMenuSFX.play()
    }
}

function purchaseHover() {
    if (energy >= nextDonutPrice) {
        donutPurchase.classList.add("rich");
    } else {
        donutPurchase.classList.add("poor");
    };
};

function purchaseUnhover() {
    donutPurchase.classList.remove("rich")
    donutPurchase.classList.remove("poor")
};

function donutHover() {
    if (upgradeStat["clickType"] === 2) {
        clickDonut();
    } else if (upgradeStat["clickType"] && mouseDown) {
        clickDonut();
    };
};

function upgradeHover(event) {
    const name = event.currentTarget.dataset.name
    const cost = event.currentTarget.dataset.price
    const description = event.currentTarget.dataset.description
    const level = event.currentTarget.dataset.level

    upgradeName.innerHTML = name
    upgradePrice.innerHTML = `${cost} energy`
    upgradeDescription.innerHTML = description
    if (level === "") {
        upgradeLevel.innerHTML = ""
    } else {
        upgradeLevel.innerHTML = `Level: ${level}`
    }

    hoverSFX.currentTime = 0;
    hoverSFX.play();
};

function getBigPrice(stringPrice) {
    const suffix = stringPrice.at(-1);
    if (suffix === "0") {return BigInt(stringPrice);};
    const stringNum = stringPrice.slice(0,-1);
    const small = BigInt(stringNum * 1000);

    if (suffix === "k") {
        return small
    } else if (suffix === "m") {
        return small * (1000n)
    } else if (suffix === "b") {
        return small * (1000n ** 2n)
    } else if (suffix === "t") {
        return small * (1000n ** 3n)
    } else if (suffix === "q") {
        return small * (1000n ** 4n)
    } else if (suffix === "Q") {
        return small * (1000n ** 5n)
    } else if (suffix === "s") {
        return small * (1000n ** 6n)
    } else if (suffix === "S") {
        return small * (1000n ** 7n)
    } else if (suffix === "o") {
        return small * (1000n ** 8n)
    } else if (suffix === "n") {
        return small * (1000n ** 9n)
    } else if (suffix === "d") {
        return small * (1000n ** 10n)
    };
    return small;
}

function upgradeClick(event) {
    const compare = getBigPrice(event.currentTarget.dataset.price)
    console.log(compare)
    if (energy >= compare || devMode) {
        energy -= compare
        updateCounter()

        const id = event.currentTarget.dataset.id

        if (Object.hasOwn(upgradeOwned, id)) {
            upgradeOwned[id] += 1
        } else {
            upgradeOwned[id] = 1
        }

        console.log(upgradeOwned)

        buySFX.currentTime = 0;
        buySFX.play();
    } else {
        poorSFX.currentTime = 0;
        poorSFX.play();
    };
};

document.addEventListener("mousedown", () => {
    mouseDown = true;
});
document.addEventListener("mouseup", () => {
    mouseDown = false;
});

updateDonut();
updateUpgrades();