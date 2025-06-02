export function initClientSlider() {
  new Swiper("[information-block-client-slider]", {
    slidesPerView: 5,
    breakpoints: {
      200: {
        slidesPerView: 1.32,
        spaceBetween: 5,
      },
      768: {
        spaceBetween: aPixels(5),
        slidesPerView: 5,
        // slidesPerView: 2.2
      },
      resizeObserver: false,
    },
    on: {
      beforeInit: function (sw) {
        addNavigationToSlider(sw);
      },
      beforeResize: function () {
      },
    },
  });
}

export function trophiesSlider() {
  new Swiper(".trophies-slider", {
    wrapperClass: "swiper-wrapper",
    slideClass: "swiper-slide",

    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      200: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
    },
  });
}

export function initInformationSlider() {
  new Swiper("[information-block-slider]", {
    wrapperClass: "swiper-wrapper",
    slideClass: "swiper-slide",

    slidesPerView: 6,
    breakpoints: {
      200: {
        slidesPerView: 1.75,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 6,
        spaceBetween: aPixels(48),
      },
    },

    on: {
      beforeInit: function (sw) {
        addNavigationToSlider(sw);
      },
      resize: function () {
        if (isMobile()) {
          this.destroy(false, true);
        }
      },
    },
  });
}
function addNavigationToSlider(sw) {
  if (
    sw.params.slidesPerView >=
    sw.el.querySelectorAll("." + sw.params.slideClass).length
  ) {
    return
  }
  const navigation = document.createElement("div");
  navigation.classList.add("slider-arrow-navigation");
  navigation.setAttribute("js-show-in-viewport", "");

  navigation.innerHTML = `<div class="slider-arrow-navigation__prev"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 56 56"><path stroke="#fff" stroke-linecap="round" d="M32 18 22 28l10 10"/></svg></div><div class="slider-arrow-navigation__next"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 56 56"><path stroke="#fff" stroke-linecap="round" d="m24 38 10-10-10-10"/></svg></div>`;
  sw.el.after(navigation);
  const navigationEl = sw.el.parentNode.querySelector(
    ".slider-arrow-navigation"
  );
  sw.params.navigation.nextEl = navigationEl.querySelector(
    ".slider-arrow-navigation__next"
  );
  sw.params.navigation.prevEl = navigationEl.querySelector(
    ".slider-arrow-navigation__prev"
  );
}
