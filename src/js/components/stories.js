import { disableScroll } from "../functions/disable-scroll";
import { enableScroll } from "../functions/enable-scroll";
import { unwrapTpl } from "../functions/templates";

const isProd = false;
class FsSliderOptionsCallbacks {
  // Вызывается после монтажа слайдов
  afterSliderFill = () => {};
  // Вызывается после инициализации
  afterFsSliderInit = () => {};
  // Вызывается последним после закрытия
  afterDestroy = () => {};
  beforeInit = () => {};
}
class FsSliderOptions {
  srcArr = undefined;
  initialSlide = 0;
  fsTplSel = ".stories-fs-tpl";
  fsItemTplSel = ".stories-fs-item-tpl-video";
  itemVideoSel = "[stories-js-video]";
  itemPreviewSel = "[stories-js-preview]";
  itemDescSel = "[stories-js-desc]";
  sliderSel = ".stories-fs-inner";
  sliderWrapperSel = ".stories-fs-wrapper";
  fsBgSel = ".stories-fs-bg";
}
class FsSlider {
  constructor(options = {}, callbacks = {}) {
    this.opt = {
      ...new FsSliderOptions(),
      ...options,
    };
    this.cb = {
      ...new FsSliderOptionsCallbacks(),
      ...callbacks,
    };

    this.init();
  }
  init() {
    this.fsTpl = document.querySelector(this.opt.fsTplSel);
    this.fsItemTpl = document.querySelector(this.opt.fsItemTplSel);
    if (this.checkTemplates()) {
      return;
    }
    this.videoCtrArr = [];
    this.activeVideo = undefined;
    this.videoMuted = window.isMobile();
    this.createSlider();
    this.fillSlider();
    this.mountSlider();
    this.initSwiper();
    this.initMute();
    this.cb.afterFsSliderInit();
    this.storiesFs
      .querySelector(this.opt.fsBgSel)
      ?.addEventListener("click", () => {
        this.closeSlider();
      });
    this.storiesFs
      .querySelectorAll(".close-btn, [js-modal-open]")
      ?.forEach((el) => {
        el.addEventListener("click", () => {
          this.closeSlider();
        });
      });
  }
  checkTemplates() {
    if (!this.fsTpl) {
      console.warn("no fullscreen stories template");
      return true;
    }
    if (!this.fsItemTpl) {
      console.warn("no fullscreen item template");
      return true;
    }
    return false;
  }
  createSlider() {
    this.fsSliderUnmounted = unwrapTpl(this.fsTpl);

    this.fsSliderWrapper = this.fsSliderUnmounted.querySelector(
      this.opt.sliderWrapperSel
    );
  }
  mountSlider() {
    this.storiesFs = document.body.appendChild(this.fsSliderUnmounted);
  }
  fillSlider() {
    this.opt.srcArr.forEach((story, index) => {
      const slide = unwrapTpl(this.fsItemTpl);
      const slideVideo = slide.querySelector(this.opt.itemVideoSel);
      const slidePreview = slide.querySelector(this.opt.itemPreviewSel);
      const slideDesc = slide.querySelector(this.opt.itemDescSel);
      slideVideo.dataset.videoSrc = story.src;
      slideDesc.innerHTML = story.desc;
      slidePreview.style.backgroundImage = `url(${story.preview})`;
      this.fsSliderWrapper.appendChild(slide);
      this.videoCtrArr.push(slideVideo);
    });
    this.cb.afterSliderFill();
  }
  playVideo(videoEl) {
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          videoEl.parentElement.classList?.remove("paused-video");
        })
        .catch(function (error) {
          videoEl.parentElement.classList?.add("paused-video");
        });
    }
  }
  slideTo(slideToIndex = 0) {
    this.swiper.slideTo(slideToIndex, 0);
  }
  initMute() {
    this.storiesFs
      .querySelector(".mute-button")
      ?.addEventListener("click", (e) => {
        this.videoMuted = !this.videoMuted;
        this.activeVideo.muted = this.videoMuted;
        e.currentTarget.innerText = this.videoMuted
          ? "Выключить звук"
          : "Включить звук";
      });
  }
  mountVideo(ctr, source, muted) {
    // video.autoplay = false
    const existingVideo = ctr.querySelector("video");
    if (existingVideo) {
      return existingVideo;
    }
    const video = document.createElement("video");
    if (muted) {
      video.setAttribute("muted", "");
      video.muted = true;
    }

    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "webkit-playsinline");
    video.setAttribute("disablepictureinpicture", "true");
    video.src = source;
    return ctr.appendChild(video);
  }
  mountVideoThenPlay(sw, fsSlider) {
    fsSlider.activeVideo && fsSlider.activeVideo.remove();
    const activeVideoCtr = fsSlider.videoCtrArr[sw.activeIndex];
    fsSlider.activeVideo = fsSlider.mountVideo(
      activeVideoCtr,
      activeVideoCtr.dataset.videoSrc,
      fsSlider.videoMuted
    );
    if (fsSlider.activeVideo) {
      fsSlider.playVideo(fsSlider.activeVideo);
      fsSlider.activeVideo.addEventListener(
        "ended",
        () => {
          fsSlider.swiper.slideNext();
        },
        { once: true }
      );
    }
  }
  closeSlider() {
    enableScroll();
    this.storiesFs.classList.remove("is-active");

    this.swiper.destroy();
    this.storiesFs.remove();
    this.cb.afterDestroy();
  }
  initSwiper() {
    const is = this.opt.initialSlide;
    this.swiper = new window.Swiper(
      this.storiesFs.querySelector(this.opt.sliderSel),
      {
        ...this.swiperConfig,
        initialSlide: this.opt.initialSlide,
        on: {
          afterInit: (sw) => {
            this.mountVideoThenPlay(sw, this);
          },
          slideChange: (sw) => {
            this.swiperSlideChange(sw, this);
          },

          slideChangeTransitionEnd: (sw) => {
            this.mountVideoThenPlay(sw, this);
          },
        },
      }
    );
  }

  swiperSlideChange(sw, fsSlider) {
    if (fsSlider.activeVideo) {
      fsSlider.activeVideo.currentTime = 0;
      fsSlider.activeVideo.pause();
    }
  }

  swiperConfig = {
    wrapperClass: "swiper-wrapper",
    slideClass: "swiper-slide",
    spaceBetween: 0,
    centeredSlides: true,
    pagination: {
      el: ".slider-navigation .slider-navigation__pagination",
      type: "bullets",
    },
    navigation: {
      prevEl: ".slider-navigation .slider-navigation__prev",
      nextEl: ".slider-navigation .slider-navigation__next",
    },
    allowTouchMove: false,
    breakpoints: {
      200: {
        spaceBetween: 0,
        slidesPerView: 1,
        allowTouchMove: true,
      },
      768: {
        slidesPerView: 2.72,
        allowTouchMove: false,
        spaceBetween: window.aPixels(338),
      },
    },
  };
}

class storiesOptionsCallbacks {}
class storiesOptions {
  sourcesType = "inMinis";
  srcArr = undefined;
  headSel = ".stories";
  minisSel = ".stories-item";
  // events
  beforeInit = () => {};
  beforeOpen = () => {};
  afterInit = () => {};
  // fullscreen events
  FsAfterDestroy = () => {};
  FsBeforeInit = () => {};
  FsAfterInit = () => {};
}

export default class Stories {
  constructor(options = {}) {
    this.opt = {
      ...new storiesOptions(),
      ...options,
    };
    this.init();
  }
  init() {
    this.opt.beforeInit();
    this.head = document.querySelector(this.opt.headSel);
    if (!this.head) {
      return;
    }
    this.minisArr = this.head.querySelectorAll(this.opt.minisSel);
    this.srcArr = this.getSources();
    this.addListenersToMinis();
    this.opt.afterInit();
  }
  getSources() {
    // получение источников видео в зависимости от типа
    let sources;
    switch (this.opt.sourcesType) {
      case "inMinis": {
        sources = Array.from(this.minisArr).map((el) => {
          return {
            src: el.dataset.videoSrc,
            desc: el.querySelector(".stories-item-desc span").textContent || "",
            preview: el.dataset.imgSrc,
          };
        });
        break;
      }
      case "Array": {
        sources = this.opt.srcArr;
        break;
      }
    }
    return sources;
  }
  getDescriptions() {}
  addListenersToMinis() {
    this.minisArr.forEach((el, minisIndex) => {
      el.addEventListener("click", (event) => {
        this.storiesOpen(minisIndex);
      });
    });
  }

  storiesOpen(index) {
    const afterFsDestroy = () => {
      this.fsSlider = undefined;
      this.opt.FsAfterDestroy();
    };

    disableScroll();
    // this.fsSlider.slideTo(index);
    this.opt.beforeOpen();
    this.fsSlider = new FsSlider(
      {
        srcArr: this.srcArr,
        initialSlide: index,
      },
      {
        afterDestroy: afterFsDestroy,
        afterFsSliderInit: this.opt.FsAfterInit,
        beforeInit: this.opt.FsBeforeInit,
      }
    );
    this.fsSlider.storiesFs.classList.add("is-active");
  }
}
const stories = document.querySelector(".stories");
if (isMobile() && stories) {
  window.stories = new Stories({
    afterInit: () => {
      const storiesHeight = stories.offsetHeight;
      document
        .querySelector(":root")
        .style.setProperty("--stories-height", `${storiesHeight}px`);
    },
    FsAfterDestroy: () => {
      window.banner && window.banner.unpauseRender();
    },
    beforeOpen: () => {
      window.banner && window.banner.pauseRender();
    },
  });
}
