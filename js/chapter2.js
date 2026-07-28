document.addEventListener("DOMContentLoaded", () => {
  const chapter = document.getElementById("chapter2");
  const motionButton = document.getElementById("enableOceanMotion");
  const motionStatus = document.getElementById("oceanMotionStatus");

  if (!chapter) return;

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
