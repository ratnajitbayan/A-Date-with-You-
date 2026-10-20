
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =========================================
  // PERSONAL SETTINGS — CHANGE THESE
  // =========================================

  const CONFIG = {
    herName: "Beautiful",
    whatsappNumber: "918927100429",
    defaultPlace: "Let's decide together",
    defaultMessage:
      "I don't need a perfect day. I just want a day with you. ♡"
  };

  // Put your MP3 at assets/music.mp3.

  // =========================================
  // ELEMENTS
  // =========================================

  const $ = (id) => document.getElementById(id);

  const screenIds = [
    "welcomeScreen",
    "questionScreen",
    "surpriseScreen",
    "plannerScreen",
    "previewScreen",
    "endingScreen"
  ];

  const screens = screenIds.map($).filter(Boolean);

  const progress = $("progress");
  const musicToggle = $("musicToggle");
  const musicLabel = $("musicLabel");
  const music = $("backgroundMusic");
  const heartsLayer = $("heartsLayer");

  const openSurpriseBtn = $("openSurpriseBtn");
  const brandHome = $("brandHome");
  const yesBtn = $("yesBtn");
  const noBtn = $("noBtn");
  const choiceArea = $("choiceArea");
  const questionHint = $("questionHint");

  const planDateBtn = $("planDateBtn");
  const dateForm = $("dateForm");
  const dateInput = $("dateInput");
  const timeInput = $("timeInput");
  const placeInput = $("placeInput");
  const typeGrid = $("typeGrid");
  const otherTypeInput = $("otherTypeInput");
  const personalMessageInput = $("personalMessageInput");
  const formError = $("formError");

  const previewDate = $("previewDate");
  const previewTime = $("previewTime");
  const previewPlace = $("previewPlace");
  const previewTypes = $("previewTypes");
  const previewMessage = $("previewMessage");

  const editPlanBtn = $("editPlanBtn");
  const sendWhatsAppBtn = $("sendWhatsAppBtn");
  const continueEndingBtn = $("continueEndingBtn");
  const previewError = $("previewError");
  const restartBtn = $("restartBtn");

  let currentScreen = "welcomeScreen";
  let musicPlaying = false;
  let noMoves = 0;
  let heartTimer = null;

  // =========================================
  // SCREEN NAVIGATION
  // =========================================

  function goTo(screenId) {
    const target = $(screenId);
    if (!target) return;

    screens.forEach((screen) => {
      const isActive = screen.id === screenId;

      screen.classList.toggle("active", isActive);
      screen.setAttribute("aria-hidden", String(!isActive));
    });

    currentScreen = screenId;
    updateProgress(screenId);

    if (screenId === "plannerScreen") {
      $("plannerScreen").scrollTop = 0;
    }

    if (screenId === "previewScreen" || screenId === "endingScreen") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }

  function updateProgress(screenId) {
    if (!progress) return;

    const dots = [...progress.querySelectorAll(".progress-dot")];
    const index = screenIds.indexOf(screenId);

    // Six screens are represented by five progress markers.
    const marker = Math.min(
      dots.length - 1,
      Math.round((index / (screenIds.length - 1)) * (dots.length - 1))
    );

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === marker);
      dot.classList.toggle("done", i < marker);
    });
  }

  if (openSurpriseBtn) {
    openSurpriseBtn.addEventListener("click", () => {
      goTo("questionScreen");
    });
  }

  if (brandHome) {
    brandHome.addEventListener("click", (event) => {
      event.preventDefault();
      goTo("welcomeScreen");
    });
  }

  if (yesBtn) {
    yesBtn.addEventListener("click", () => {
      goTo("surpriseScreen");
      startMusic();
    });
  }

  if (planDateBtn) {
    planDateBtn.addEventListener("click", () => {
      goTo("plannerScreen");
    });
  }

  // =========================================
  // NO BUTTON — DODGES BUT STAYS ON SCREEN
  // =========================================

  function moveNoButton() {
    if (!noBtn || !choiceArea) return;

    const area = choiceArea;
    const areaRect = area.getBoundingClientRect();

    // Reserve enough room for the button to move around.
    area.style.minHeight = "135px";
    area.style.position = "relative";

    noBtn.style.position = "absolute";
    noBtn.style.zIndex = "3";
    noBtn.style.transition = "left 0.18s ease, top 0.18s ease";

    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    const maxLeft = Math.max(0, area.clientWidth - btnWidth);
    const maxTop = Math.max(0, area.clientHeight - btnHeight);

    let left = Math.random() * maxLeft;
    let top = Math.random() * maxTop;

    // On narrow screens, keep the button near the vertical centre.
    if (area.clientWidth < 380) {
      top = Math.random() * maxTop;
    }

    noBtn.style.left = `${Math.min(left, maxLeft)}px`;
    noBtn.style.top = `${Math.min(top, maxTop)}px`;

    noMoves++;

    const messages = [
      "No 🙈",
      "Catch me!",
      "Think again ♡",
      "Not so fast!",
      "Pretty please?",
      "Try again 😜"
    ];

    noBtn.textContent = messages[
      Math.min(noMoves, messages.length - 1)
    ];

    if (questionHint) {
      questionHint.textContent = "Hehe... maybe YES is easier to catch. ♡";
    }
  }

  if (noBtn) {
    noBtn.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") {
        moveNoButton();
      }
    });

    noBtn.addEventListener("click", (event) => {
      event.preventDefault();
      moveNoButton();
    });

    noBtn.addEventListener("touchstart", (event) => {
      event.preventDefault();
      moveNoButton();
    }, { passive: false });

    noBtn.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        moveNoButton();
      }
    });
  }

  // =========================================
  // MUSIC
  // =========================================

  function updateMusicUI() {
    if (musicLabel) {
      musicLabel.textContent = musicPlaying ? "Music On" : "Music Off";
    }

    if (musicToggle) {
      musicToggle.classList.toggle("playing", musicPlaying);
      musicToggle.setAttribute("aria-pressed", String(musicPlaying));
    }
  }

  async function startMusic() {
    if (!music) return;

    try {
      music.volume = 0.35;
      await music.play();
      musicPlaying = true;
    } catch (error) {
      musicPlaying = false;
      console.info("Music could not start yet. Tap the Music button.");
    }

    updateMusicUI();
  }

  function stopMusic() {
    if (music) music.pause();
    musicPlaying = false;
    updateMusicUI();
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (!music) return;

      if (musicPlaying) {
        stopMusic();
      } else {
        await startMusic();
      }
    });
  }

  if (music) {
    music.addEventListener("play", () => {
      musicPlaying = true;
      updateMusicUI();
    });

    music.addEventListener("pause", () => {
      musicPlaying = false;
      updateMusicUI();
    });

    music.addEventListener("error", () => {
      musicPlaying = false;
      updateMusicUI();
      console.warn("Check that assets/music.mp3 exists.");
    });
  }

  // =========================================
  // DATE INPUT
  // =========================================

  function localDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (dateInput) {
    dateInput.min = localDateString();
  }

  // =========================================
  // ACTIVITIES AND CUSTOM OPTION
  // =========================================

  function getCheckedActivities() {
    if (!typeGrid) return [];

    const checked = [
      ...typeGrid.querySelectorAll('input[type="checkbox"]:checked')
    ];

    return checked.map((input) => {
      if (input.value === "Other") {
        const custom = otherTypeInput?.value.trim();
        return custom || "Something special";
      }

      return input.value;
    });
  }

  function updateActivitySelection() {
    if (!typeGrid) return;

    const checkboxes = [
      ...typeGrid.querySelectorAll('input[type="checkbox"]')
    ];

    let otherChecked = false;

    checkboxes.forEach((checkbox) => {
      const label = checkbox.closest(".type-option");

      if (label) {
        label.classList.toggle("selected", checkbox.checked);
      }

      if (checkbox.value === "Other" && checkbox.checked) {
        otherChecked = true;
      }
    });

    if (otherTypeInput) {
      otherTypeInput.hidden = !otherChecked;
      otherTypeInput.required = otherChecked;

      if (!otherChecked) {
        otherTypeInput.value = "";
      }
    }
  }

  if (typeGrid) {
    typeGrid.addEventListener("change", (event) => {
      if (event.target.matches('input[type="checkbox"]')) {
        updateActivitySelection();
      }
    });
  }

  // =========================================
  // FORM VALIDATION
  // =========================================

  function showError(element, message) {
    if (!element) return;

    element.textContent = message;
    element.hidden = false;
  }

  function clearError(element) {
    if (!element) return;

    element.textContent = "";
    element.hidden = true;
  }

  function validatePlan() {
    clearError(formError);

    if (!dateInput?.value) {
      showError(formError, "Please choose a date for our little adventure. ♡");
      dateInput?.focus();
      return false;
    }

    if (dateInput.value < localDateString()) {
      showError(formError, "Please choose today or a future date.");
      dateInput.focus();
      return false;
    }

    if (!timeInput?.value) {
      showError(formError, "Please choose a time for our date.");
      timeInput?.focus();
      return false;
    }

    if (otherTypeInput?.required && !otherTypeInput.value.trim()) {
      showError(formError, "Tell me what you'd like to do for our custom date.");
      otherTypeInput.focus();
      return false;
    }

    return true;
  }

  // =========================================
  // FORMAT DATE AND TIME
  // =========================================

  function formatDate(value) {
    if (!value) return "Not selected";

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) return value;

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function formatTime(value) {
    if (!value) return "Not selected";

    const [hour, minute] = value.split(":").map(Number);

    if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
      return value;
    }

    const date = new Date();
    date.setHours(hour, minute, 0, 0);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  }

  // =========================================
  // PREVIEW
  // =========================================

  function populatePreview() {
    if (previewDate) {
      previewDate.textContent = formatDate(dateInput?.value);
    }

    if (previewTime) {
      previewTime.textContent = formatTime(timeInput?.value);
    }

    if (previewPlace) {
      previewPlace.textContent =
        placeInput?.value.trim() || CONFIG.defaultPlace;
    }

    if (previewTypes) {
      previewTypes.replaceChildren();

      const activities = getCheckedActivities();

      if (!activities.length) {
        previewTypes.textContent = "A surprise date ♡";
      } else {
        activities.forEach((activity) => {
          const chip = document.createElement("span");
          chip.className = "preview-chip";
          chip.textContent = activity;
          previewTypes.appendChild(chip);
        });
      }
    }

    if (previewMessage) {
      previewMessage.textContent =
        personalMessageInput?.value.trim() || CONFIG.defaultMessage;
    }
  }

  if (dateForm) {
    dateForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validatePlan()) return;

      populatePreview();
      clearError(previewError);
      goTo("previewScreen");
    });
  }

  // =========================================
  // EDIT PLAN
  // =========================================

  if (editPlanBtn) {
    editPlanBtn.addEventListener("click", () => {
      clearError(formError);
      goTo("plannerScreen");
    });
  }

  // =========================================
  // WHATSAPP MESSAGE
  // =========================================

  function buildMessage() {
    const activities = getCheckedActivities();

    const date = formatDate(dateInput?.value);
    const time = formatTime(timeInput?.value);
    const place = placeInput?.value.trim() || CONFIG.defaultPlace;
    const customMessage =
      personalMessageInput?.value.trim() || CONFIG.defaultMessage;

    return [
      `Hey ${CONFIG.herName} ♡`,
      "",
      "I've planned something special for us.",
      "",
      "✦ A DATE WITH YOU ✦",
      "",
      `Date: ${date}`,
      `Time: ${time}`,
      `Place: ${place}`,
      `Our plan: ${activities.length ? activities.join(", ") : "A surprise date"}`,
      "",
      "A little message for you:",
      customMessage,
      "",
      "So... will you go on this date with me? ♡",
      "",
      "Made with love, just for you."
    ].join("\n");
  }

  function getWhatsAppNumber() {
    return CONFIG.whatsappNumber.replace(/\D/g, "");
  }

  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener("click", () => {
      clearError(previewError);

      if (!validatePlan()) {
        goTo("plannerScreen");
        return;
      }

      const number = getWhatsAppNumber();

      // Do not silently use an example phone number.
      if (!number || number.endsWith("XXXXXXXXXX")) {
        showError(
          previewError,
          "First replace CONFIG.whatsappNumber in script.js with the real WhatsApp number, including the country code. Example format: 919876543210."
        );
        return;
      }

      const message = buildMessage();
      const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp from the user's click.
      const newWindow = window.open(url, "_blank", "noopener,noreferrer");

      // If pop-ups are blocked, fall back to same-tab navigation.
      if (!newWindow) {
        window.location.href = url;
      }
    });
  }

  // =========================================
  // ENDING AND RESTART
  // =========================================

  if (continueEndingBtn) {
    continueEndingBtn.addEventListener("click", () => {
      goTo("endingScreen");
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (dateForm) dateForm.reset();

      noMoves = 0;

      if (noBtn) {
        noBtn.textContent = "No 🙈";
        noBtn.style.position = "";
        noBtn.style.left = "";
        noBtn.style.top = "";
        noBtn.style.zIndex = "";
        noBtn.style.transition = "";
      }

      if (choiceArea) {
        choiceArea.style.minHeight = "";
      }

      if (questionHint) {
        questionHint.textContent =
          "Choose honestly... if you can catch the other button.";
      }

      clearError(formError);
      clearError(previewError);
      updateActivitySelection();
      goTo("welcomeScreen");
    });
  }

  // =========================================
  // FLOATING HEARTS
  // =========================================

  function createHeart() {
    if (!heartsLayer) return;

    const heart = document.createElement("span");
    heart.className = "floating-heart";

    const symbols = ["♡", "♥", "✧", "❦"];
    heart.textContent = symbols[
      Math.floor(Math.random() * symbols.length)
    ];

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.fontSize = `${11 + Math.random() * 18}px`;
    heart.style.animationDuration = `${8 + Math.random() * 7}s`;

    heartsLayer.appendChild(heart);

    heart.addEventListener("animationend", () => {
      heart.remove();
    }, { once: true });
  }

  function startHeartAnimation() {
    if (!heartsLayer || heartTimer) return;

    for (let i = 0; i < 9; i++) {
      setTimeout(createHeart, i * 400);
    }

    heartTimer = setInterval(createHeart, 1200);
  }

  // =========================================
  // INITIALIZE
  // =========================================

  updateActivitySelection();
  updateMusicUI();
  goTo("welcomeScreen");
  startHeartAnimation();

  console.log("A Date with You is ready ♡");
});
