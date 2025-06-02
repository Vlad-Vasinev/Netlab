import { initClientSlider, initInformationSlider, trophiesSlider } from "./sliders";

window.startFunc = function () {
  console.log("grecaptcha is ready");
};
window.vars = {};

if (isMobile()) {
} else {
  initInformationSlider();
  rolloutBlockInit();
}

inViewport();
initClientSlider();
jsInputFocus();
trophiesSlider();

function rolloutBlockInit() {
  document.querySelectorAll(".rollout-tags-block").forEach((item) => {
    item.querySelectorAll(".rollout-tags-block-item").forEach((item) => {
      item.addEventListener("mouseenter", (e) => {
        const target = e.currentTarget;
        target.classList.remove("delayed-close");
        target.classList.add("active");
      });
      item.addEventListener("mouseleave", (e) => {
        const target = e.currentTarget;
        target.classList.add("delayed-close");
        target.classList.remove("active");
        setTimeout(() => {
          target.classList.remove("delayed-close");
        }, 600);
      });
    });
  });
}
function inViewport() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.05,
  };

  function observerCallback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("inView");
        observer.unobserve(entry.target);
      }
    });
  }

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const showInViewport = document.querySelectorAll("[js-show-in-viewport]");
  showInViewport.forEach((el) => {
    observer.observe(el);
  });
}

function jsInputFocus() {
  const elements = document.querySelectorAll("[js-input-focus]");
  if (elements.length !== 0) {
    elements.forEach((el) => {
      const input = el.querySelector(
        "input, textarea, .textarea[contenteditable]"
      );

      if (input.value) {
        el.classList.add("is-focused");
      }

      input.addEventListener("focus", function () {
        el.classList.add("is-focused");
      });

      input.addEventListener("blur", function () {
        if (input.value?.trim() || input.textContent !== "") {
          el.classList.add("is-focused");
        } else {
          el.classList.remove("is-focused");
        }
      });
    });
  }
}