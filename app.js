let totalCookies = 0;
let cookiesPerSecond = 1;
let currentImageIndex = 0;

const cookieImages = [
  "Cookie 1.PNG",
  "Cookie 2.PNG",
  "Cookie 3.PNG",
  "Cookie 4.PNG",
  "Cookie 5.PNG",
  "Cookie 6.PNG",
  "Cookie 7.PNG",
  "Cookie 8.PNG",
];
const totalCookiesDisplay = document.getElementById("totalCookies");
const cookiesPerSecondDisplay = document.getElementById("cookiesPerSecond");
const bigCookieImage = document.getElementById("bigCookie");
const upgradeContainer = document.getElementById("buttonContainer");
const chompSound = new Audio("chomp.wav");
chompSound.volume = 0.05;
const upgradeSound = new Audio("upgrade.wav");
upgradeSound.volume = 0.2;
const errorSound = new Audio("error.wav");
errorSound.volume = 0.3;

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.classList.add("show");
  notification.classList.remove("hidden");

  setTimeout(function () {
    notification.classList.add("hidden");
    notification.classList.remove("show");
  }, 5000);
}

bigCookieImage.addEventListener("click", function () {
  totalCookies++;
  currentImageIndex = (currentImageIndex + 1) % cookieImages.length;
  chompSound.currentTime = 0;
  chompSound.play();
  updateUI();
  saveGame();
});

function updateUI() {
  totalCookiesDisplay.innerText = `Cookies: ${totalCookies}`;
  cookiesPerSecondDisplay.innerText = `Cookies per second: ${cookiesPerSecond}`;
  bigCookieImage.src = cookieImages[currentImageIndex];
}
updateUI();

function update() {
  totalCookies += cookiesPerSecond;
  console.log(totalCookies);
  updateUI();
}
setInterval(update, 1000);

const api = "https://cookie-upgrade-api.vercel.app/api/upgrades";

async function fetchUpgrades() {
  const res = await fetch(api);
  const data = await res.json();
  createUpgradeButtons(data);
}

function createUpgradeButtons(upgrades) {
  upgrades.forEach(function (upgrade) {
    const button = document.createElement("button");
    button.innerText = `${upgrade.name} {cost: ${upgrade.cost}}`;
    button.addEventListener("click", function () {
      if (totalCookies >= upgrade.cost) {
        totalCookies -= upgrade.cost;
        cookiesPerSecond += upgrade.increase;
        upgradeSound.currentTime = 0;
        upgradeSound.play();
        updateUI();
        saveGame();
      } else {
        showNotification("You don't have enough cookies!!!!!");
        errorSound.play();
      }
    });
    buttonContainer.appendChild(button);
  });
}

fetchUpgrades();

function saveGame() {
  const currentGameScore = {
    totalCookies: totalCookies,
    cookiesPerSecond: cookiesPerSecond,
    currentImageIndex: currentImageIndex,
  };
  localStorage.setItem("cookieClickerSave", JSON.stringify(currentGameScore));
}

function loadGame() {
  const storedGameScore = localStorage.getItem("cookieClickerSave");
  if (storedGameScore) {
    const currentGameScore = JSON.parse(storedGameScore);
    totalCookies = currentGameScore.totalCookies;
    cookiesPerSecond = currentGameScore.cookiesPerSecond;
    currentImageIndex = currentGameScore.currentImageIndex;
    updateUI();
  }
}

addEventListener("load", function () {
  loadGame();
});

setInterval(saveGame, 1000);
