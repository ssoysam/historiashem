const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const optionsInput = document.getElementById("optionsInput");
const spinBtn = document.getElementById("spinBtn");
const resultText = document.getElementById("resultText");

let currentRotation = 0;
let spinning = false;

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

  ctx.clearRect(0, 0, size, size);

  if (options.length === 0) {
    ctx.fillStyle = "#f7f4ee";
    ctx.textAlign = "center";
    ctx.font = "18px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    ctx.fillText("Agrega opciones", center, center);
    return;
  }

  const slice = (Math.PI * 2) / options.length;

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(rotation);

  options.forEach((option, index) => {
    const start = index * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, start, end);
    ctx.closePath();

    const pastelColors = [
  "#F7D6E0", // rosa pastel
  "#D6EAF8", // azul pastel
  "#D8F3DC", // verde pastel
  "#FFF3B0", // amarillo pastel
  "#E7D8FF", // lila pastel
  "#FFD6A5", // durazno pastel
  "#CDE7F0", // azul grisáceo
  "#FDE2E4"  // rosa claro
];

ctx.fillStyle = pastelColors[index % pastelColors.length];
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

spinBtn.addEventListener("click", spinWheel);
optionsInput.addEventListener("input", drawWheel);

drawWheel();
