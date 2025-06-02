import { disableScroll } from "../functions/disable-scroll";
import { enableScroll } from '../functions/enable-scroll';
import { getHeaderHeight } from '../functions/header-height';

function fillEffectButton() {
  document.querySelectorAll(".fill-button").forEach((el) => {
    el.clientWidth / el.clientHeight >= 1
      ? el.classList.add("_horizontal")
      : el.classList.add("_vertical");

    el.addEventListener("mouseenter", (e) => {
      const target = e.currentTarget;
      target.style.setProperty(
        "--x",
        ((e.clientX -
          Math.round(+target.getBoundingClientRect().left) -
          target.clientWidth / 2) /
          target.clientWidth) *
          100 +
          "%"
      );
      target.style.setProperty(
        "--y",
        ((e.clientY -
          Math.round(+target.getBoundingClientRect().top) +
          (target.clientWidth / 2 - target.clientHeight / 2) -
          target.clientWidth / 2) /
          target.clientWidth) *
          100 +
          "%"
      );
      target.classList.add("hovered");
    });
    el.addEventListener("mouseleave", (e) => {
      const target = e.currentTarget;
      target.style.setProperty(
        "--x",
        ((e.clientX -
          Math.round(+target.getBoundingClientRect().left) -
          target.clientWidth / 2) /
          target.clientWidth) *
          100 +
          "%"
      );
      target.style.setProperty(
        "--y",
        ((e.clientY -
          Math.round(+target.getBoundingClientRect().top) +
          (target.clientWidth / 2 - target.clientHeight / 2) -
          target.clientWidth / 2) /
          target.clientWidth) *
          100 +
          "%"
      );
      target.classList.remove("hovered");
    });
  });
}

function slideEffectButton() {
  document.querySelectorAll(".slide-button").forEach((el) => {
    const inner = document.createElement("div");
    inner.className = "slide-button-inner";
    inner.innerHTML = el.innerHTML + el.innerHTML;
    el.innerHTML = "";
    el.append(inner);
  });
}

// changeHeaderOnScroll();
if (!isMobile()) {
  fillEffectButton();
  slideEffectButton();
} else if (isMobile()) {
  // initMobileMenu();
  
}
getHeaderHeight()