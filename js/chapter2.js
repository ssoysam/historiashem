document.addEventListener("DOMContentLoaded", () => {
  const chapter = document.getElementById("chapter2");
  const motionButton = document.getElementById("enableOceanMotion");
  const motionStatus = document.getElementById("oceanMotionStatus");

  if (!chapter) return;

  const bubbleField = document.getElementById("bubbleField");
  const glowField = document.getElementById("oceanGlowParticles");
  const openLetterButton = document.getElementById("openOceanLetter");
  const letterModal = document.getElementById("oceanLetterModal");
  const closeLetterButton = document.getElementById("closeOceanLetter");
  const closeLetterBackdrop = document.getElementById("closeOceanLetterBackdrop");

  function createOceanLife() {
    if (bubbleField && !bubbleField.children.length) {
      for (let i = 0; i < 22; i += 1) {
        const bubble = document.createElement("span");
        bubble.className = "bubble";
        bubble.style.setProperty("--left", `${Math.random() * 100}%`);
        bubble.style.setProperty("--size", `${5 + Math.random() * 18}px`);
        bubble.style.setProperty("--duration", `${10 + Math.random() * 16}s`);
        bubble.style.setProperty("--delay", `${-Math.random() * 22}s`);
        bubble.style.setProperty("--drift", `${-35 + Math.random() * 70}px`);
        bubbleField.appendChild(bubble);
      }
    }

    if (glowField && !glowField.children.length) {
      for (let i = 0; i < 28; i += 1) {
        const particle = document.createElement("span");
        particle.className = "glow-particle";
        particle.style.setProperty("--left", `${Math.random() * 100}%`);
        particle.style.setProperty("--top", `${18 + Math.random() * 78}%`);
        particle.style.setProperty("--size", `${2 + Math.random() * 4}px`);
        particle.style.setProperty("--duration", `${5 + Math.random() * 8}s`);
        particle.style.setProperty("--delay", `${-Math.random() * 10}s`);
        particle.style.setProperty("--drift", `${-20 + Math.random() * 40}px`);
        glowField.appendChild(particle);
      }
    }
  }

  function openLetter() {
    if (!letterModal) return;
    const letterPaper = letterModal.querySelector(".ocean-letter");
    if (letterPaper) letterPaper.scrollTop = 0;

    letterModal.classList.add("is-open");
    letterModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("ocean-letter-open");
    closeLetterButton?.focus({ preventScroll: true });
  }

  function closeLetter() {
    if (!letterModal) return;
    letterModal.classList.remove("is-open");
    letterModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("ocean-letter-open");
    openLetterButton?.focus();
  }

  openLetterButton?.addEventListener("click", openLetter);
  closeLetterButton?.addEventListener("click", closeLetter);
  closeLetterBackdrop?.addEventListener("click", closeLetter);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && letterModal?.classList.contains("is-open")) closeLetter();
  });

  createOceanLife();

  const root = chapter;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasOrientation = "DeviceOrientationEvent" in window;
  const needsIOSPermission =
    hasOrientation &&
    typeof DeviceOrientationEvent.requestPermission === "function";

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let scrollFrame = 0;
  let pointerStarted = false;
  let orientationStarted = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function setStatus(message) {
    if (motionStatus) motionStatus.textContent = message;
  }

  function updateDepth() {
    const maxScroll = Math.max(1, chapter.scrollHeight - chapter.clientHeight);
    const depth = clamp(chapter.scrollTop / maxScroll, 0, 1);
    root.style.setProperty("--ocean-depth", depth.toFixed(4));
    scrollFrame = 0;
  }

  chapter.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateDepth);
    },
    { passive: true }
  );

  window.addEventListener("resize", updateDepth, { passive: true });

  function handleOrientation(event) {
    if (typeof event.gamma !== "number" || typeof event.beta !== "number") return;

    targetX = clamp(event.gamma / 28, -1, 1);
    targetY = clamp((event.beta - 45) / 34, -1, 1);
  }

  function startOrientation() {
    if (!orientationStarted) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      orientationStarted = true;
    }

    motionButton?.classList.remove("is-visible");
    motionButton?.classList.add("is-hidden");
    setStatus("Movimiento activado");
  }

  function startPointer() {
    if (pointerStarted) return;
    pointerStarted = true;

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1);
        targetY = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1);
      },
      { passive: true }
    );
  }

  async function requestMotion() {
    motionButton?.setAttribute("disabled", "");
    setStatus("Solicitando permiso…");

    try {
      if (needsIOSPermission) {
        const permission = await DeviceOrientationEvent.requestPermission();

        if (permission === "granted") {
          startOrientation();
        } else {
          setStatus("El movimiento no fue autorizado");
          motionButton?.removeAttribute("disabled");
        }
        return;
      }

      if (hasOrientation) {
        startOrientation();
      } else {
        startPointer();
        setStatus("Tu dispositivo no usa movimiento; el océano seguirá funcionando al deslizar");
        motionButton?.classList.add("is-hidden");
      }
    } catch (error) {
      console.warn("No se pudo activar el movimiento del océano:", error);
      setStatus("No fue posible activar el movimiento, pero puedes seguir sumergiéndote");
      motionButton?.removeAttribute("disabled");
    }
  }

  motionButton?.addEventListener("click", requestMotion);

  if (finePointer) {
    startPointer();
    motionButton?.classList.add("is-hidden");
  } else if (needsIOSPermission) {
    motionButton?.classList.add("is-visible");
  } else if (hasOrientation) {
    startOrientation();
  } else {
    motionButton?.classList.add("is-hidden");
  }

  function animate() {
    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;

    root.style.setProperty("--ocean-tilt-x", currentX.toFixed(4));
    root.style.setProperty("--ocean-tilt-y", currentY.toFixed(4));

    requestAnimationFrame(animate);
  }

  updateDepth();
  animate();
});
