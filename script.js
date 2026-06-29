const screens = {
  cover: document.getElementById("cover"),
  home: document.getElementById("home"),
  chapter: document.getElementById("chapter"),
  roulette: document.getElementById("roulette"),
};

const enterBtn = document.getElementById("enterBtn");
const openChapterOne = document.getElementById("openChapterOne");
const openRouletteBtn = document.getElementById("openRouletteBtn");
const backHomeFromChapter = document.getElementById("backHomeFromChapter");
const backHomeFromRoulette = document.getElementById("backHomeFromRoulette");

const nextPageBtn = document.getElementById("nextPageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const pageOne = document.getElementById("pageOne");
const pageTwo = document.getElementById("pageTwo");

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const optionsInput = document.getElementById("optionsInput");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");

let currentRotation = 0;
let spinning = false;

function goToScreen(current, next) {
  current.style.opacity = "0";

  setTimeout(() => {
    current.classList.remove("active");
    current.style.opacity = "";
    next.classList.add("active");
    window.scrollTo(0, 0);

    if (next === screens.roulette) {
      drawWheel();
    }
  }, 650);
}

function getOptions() {
  return optionsInput.value
    .split("\n")
    .map(option => option.trim())
    .filter(Boolean);
}

function drawWheel(rotation = currentRotation) {
  const options = getOptions();
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 12;
  const slice = (Math.PI * 2) / options.length;

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  if (options.length === 0) {
    ctx.fillStyle = "#f7f4ee";
    ctx.textAlign = "center";
    ctx.font = "18px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText("Agrega opciones", 0, 0);
    ctx.restore();
    return;
  }

  options.forEach((option, index) => {
    const start = index * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();

    ctx.fillStyle = index % 2 === 0 ? "#f7f4ee" : "#c9c2b7";
    ctx.fill();

    ctx.save();
    ctx.rotate(start + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#050505";
    ctx.font = "500 15px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText(option.slice(0, 18), radius - 18, 5);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fillStyle = "#050505";
  ctx.fill();

  ctx.fillStyle = "#f7f4ee";
  ctx.textAlign = "center";
  ctx.font = "500 13px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("SHEM", 0, 5);

  ctx.restore();
}

function spinWheel() {
  if (spinning) return;

  const options = getOptions();
  if (options.length < 2) {
    resultText.textContent = "Agrega al menos dos opciones.";
    drawWheel();
    return;
  }

  spinning = true;
  resultText.textContent = "Girando...";

  const slice = (Math.PI * 2) / options.length;
  const selectedIndex = Math.floor(Math.random() * options.length);

  const pointerAngle = -Math.PI / 2;
  const selectedCenter = selectedIndex * slice + slice / 2;
  const targetRotation = pointerAngle - selectedCenter;

  const extraSpins = Math.PI * 2 * (5 + Math.floor(Math.random() * 3));
  const startRotation = currentRotation;
  const endRotation = currentRotation + extraSpins + normalizeAngle(targetRotation - currentRotation);

  const duration = 4300;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);

    currentRotation = startRotation + (endRotation - startRotation) * eased;
    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      currentRotation = endRotation;
      resultText.textContent = `Resultado: ${options[selectedIndex]}`;
    }
  }

  requestAnimationFrame(animate);
}

function normalizeAngle(angle) {
  const full = Math.PI * 2;
  return ((angle % full) + full) % full;
}

enterBtn.addEventListener("click", () => goToScreen(screens.cover, screens.home));
openChapterOne.addEventListener("click", () => {
  pageOne.classList.add("active-page");
  pageTwo.classList.remove("active-page");
  goToScreen(screens.home, screens.chapter);
});
openRouletteBtn.addEventListener("click", () => goToScreen(screens.home, screens.roulette));
backHomeFromChapter.addEventListener("click", () => goToScreen(screens.chapter, screens.home));
backHomeFromRoulette.addEventListener("click", () => goToScreen(screens.roulette, screens.home));

nextPageBtn.addEventListener("click", () => {
  pageOne.classList.remove("active-page");
  pageTwo.classList.add("active-page");
  window.scrollTo(0, 0);
});

prevPageBtn.addEventListener("click", () => {
  pageTwo.classList.remove("active-page");
  pageOne.classList.add("active-page");
  window.scrollTo(0, 0);
});

spinBtn.addEventListener("click", spinWheel);
optionsInput.addEventListener("input", drawWheel);

drawWheel();
