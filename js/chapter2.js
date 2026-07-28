document.addEventListener("DOMContentLoaded", () => {
  const chapter = document.getElementById("chapter2");
  const motionButton = document.getElementById("enableOceanMotion");

  if (!chapter) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let scrollQueued = false;
  let pointerFallbackStarted = false;
  let orientationStarted = false;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function updateDepth() {
    const maxScroll = chapter.scrollHeight - chapter.clientHeight;
    const depth = maxScroll > 0
      ? clamp(chapter.scrollTop / maxScroll, 0, 1)
      : 0;

    chapter.style.setProperty("--ocean-depth", depth.toFixed(4));
    scrollQueued = false;
  }

  chapter.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateDepth);
  }, { passive: true });

  window.addEventListener("resize", updateDepth);
  updateDepth();

  function handleOrientation(event) {
    const gamma = typeof event.gamma === "number" ? event.gamma : 0;
    const beta = typeof event.beta === "number" ? event.beta : 45;

    targetX = clamp(gamma / 22, -1, 1);
    targetY = clamp((beta - 45) / 28, -1, 1);
  }

  function enableOrientation() {
    if (!orientationStarted) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      orientationStarted = true;
    }
    motionButton?.classList.add("is-hidden");
  }

  function startPointerFallback() {
    if (pointerFallbackStarted) return;
    pointerFallbackStarted = true;

    window.addEventListener("pointermove", (event) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    if (window.matchMedia("(pointer: fine)").matches) {
      motionButton?.classList.add("is-hidden");
    }
  }

  async function requestMotion() {
    try {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === "granted") enableOrientation();
        return;
      }

      if ("DeviceOrientationEvent" in window) {
        enableOrientation();
      } else {
        startPointerFallback();
      }
    } catch (error) {
      console.warn("No se pudo activar el movimiento del océano:", error);
      startPointerFallback();
    }
  }

  motionButton?.addEventListener("click", requestMotion);

  if (window.matchMedia("(pointer: fine)").matches) {
    startPointerFallback();
  }

  function animate() {
    currentX += (targetX - currentX) * 0.045;
    currentY += (targetY - currentY) * 0.045;

    chapter.style.setProperty("--ocean-tilt-x", currentX.toFixed(4));
    chapter.style.setProperty("--ocean-tilt-y", currentY.toFixed(4));

    requestAnimationFrame(animate);
  }

  animate();
});
