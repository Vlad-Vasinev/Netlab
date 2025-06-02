import JustValidate from "just-validate";
import Inputmask from "inputmask";
import { disableScroll } from ".././functions/disable-scroll";
import { enableScroll } from ".././functions/enable-scroll";

if (document.querySelector(".modal")) {
  formSwitchInit();
  const rules = [
    {
      ruleSelector: 'input[type="tel"]',
      rules: [
        {
          rule: "required",
          errorMessage: "Вы не заполнили телефон",
        },
      ],
      tel: true,
      telError: "Телефон указан неверно",
    },
    {
      ruleSelector: 'input[type="email"]',
      rules: [
        {
          rule: "required",
          errorMessage: "Вы не заполнили Email",
        },
        {
          rule: "email",
          errorMessage: "Email введен неверно",
        },
      ],
    },
    {
      ruleSelector: "input#order-site-name",
      rules: [
        {
          rule: "required",
          errorMessage: "Вы не заполнили Имя",
        },
      ],
    },
  ];

  validateForms("#orderSite", rules);
}

window.modals = {};

openModalInit({
  sel: '[js-modal-open][data-modal-name="caseModal"][data-modal-url]',
  beforeOpen: beforeCaseModalOpen,
  afterOpen: afterCaseModalOpen,
  //afterClose: afterCaseModalClose,
});

openModalInit({ sel: "[js-modal-open]" });
closeModalInit("[js-modal-close]");

function formSwitchInit() {
  const formSwitch = document.querySelector(".form-switch");
  if (formSwitch) {
    formSwitch.querySelectorAll(".form-switch__option").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.currentTarget.classList.toggle("active");
      });
    });
  }
}
function getSwitch(el) {
  const valuesArr = [];
  let values = "";
  el.querySelectorAll(".form-switch__option.active").forEach((el) => {
    valuesArr.push(el.dataset.switchOption);
  });
  values = JSON.stringify(valuesArr);
  return values;
}
function scalePage(direction = false) {
  if (!isMobile()) {
    if (direction) {
      document.body.style.setProperty(
        "--scale-origin-y",
        window.scrollY + "px"
      );
      document.body.classList.add("_scaled");
    } else {
      document.body.classList.remove("_scaled");
    }
  }
}

async function openModal(
  triggerEl,
  modal,
  beforeCallback = async () => { },
  afterCallback = async () => { }
) {
  // останавливаем баннер перед открытием модалки
  window.banner && window.banner.pauseRender();
  const open = async () => {
    modal.classList.add("opened");
    disableScroll();
    scalePage(true);
    await afterCallback(triggerEl, modal);
  }
  window.activeModal = modal
  await beforeCallback(triggerEl, modal);
  if (modal.classList.contains('_inited')) {
    open()
  }
  else {
    modal.classList.add("_inited")
    setTimeout(open, 10);
  }

}

function closeModal() {
  document.querySelectorAll(".modal.opened").forEach((item) => {
    if (item.classList.contains("case-modal")) {
      if (location.href.indexOf("/cases/") >= 0) {
        history.pushState(null, null, window.lastPathName || "/cases/");
      }
    }
    item.classList.remove("opened");
    window.activeModal = undefined
    window.modals[item.dataset.modalName]?.afterClose();
  });

  scalePage(false);
  enableScroll();
}

window.openModal = openModal;
// window.openCaseModal = openCaseModal;

function openModalInit(params) {
  const opt = {
    beforeOpen: async () => { },
    afterOpen: async () => { },
    beforeClose: async () => { },
    afterClose: async () => { },
    ...params,
  };
  document.querySelectorAll(opt.sel).forEach((triggerEl) => {
    const modalName = triggerEl.dataset.modalName;
    const modal =
      window.modals[modalName]?.el ||
      document.querySelector(`.modal[data-modal-name="${modalName}"]`);
    const addListener = (modal, triggerEl) => {
      if (modal && !triggerEl.classList.contains("_lstr-att")) {
        triggerEl.addEventListener("click", async (e) => {
          openModal(triggerEl, modal, opt.beforeOpen, opt.afterOpen);
        });
        triggerEl.classList.add("_lstr-att");
      }
    };
    if (modal.classList.contains("_inited")) {
      addListener(modal, triggerEl);
    } else {
      window.modals[modalName] = {
        el: modal,
        selector: opt.sel,
        beforeOpen: opt.beforeOpen,
        afterOpen: opt.afterOpen,
        beforeClose: opt.beforeClose,
        afterClose: opt.afterClose,
      };
      addListener(modal, triggerEl);
      modal.classList.add("_inited");
    }
  });
}

function closeModalInit(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", (e) => {
      closeModal();
      window.banner && window.banner.unpauseRender();
    });
  });
}
async function mountLayout(el, url, loader = false) {
  if (el && url) {
    let response;
    el.style.visibility = "hidden";
    el.innerHTML = "";

    if (loader?.classList) {
      loader.classList.add("visible");
    }

    try {
      response = await fetch(url);
    } catch (error) {
      console.error("There was an error", error);
    }

    if (response?.ok) {
      let data = await response.text();
      el.innerHTML = data;
      el.style.visibility = "";
      if (loader?.classList) {
        loader.classList.remove("visible");
      }
    } else {
      console.error(`HTTP Response Code: ${response?.status}`);
    }
  }
}

function beforeCaseModalOpen(triggerEl) {
  // console.log(triggerEl);
  let caseModal = document.querySelector(".modal.case-modal");
  if (
    window.vars &&
    window.vars.lstOpnCase &&
    window.vars.lstOpnCase === triggerEl.dataset.modalUrl
  ) {
    // console.log("return");
    return;
  } else {
    if (!window.vars) window.vars = {};
    window.vars.lstOpnCase = triggerEl.dataset.modalUrl;
  }

  if (caseModal) {
    if (triggerEl.dataset.modalTitle) {
      caseModal.querySelector(".modal__top span").innerText =
        triggerEl.dataset.modalTitle;
    }

    mountLayout(
      caseModal.querySelector(".modal__body"),
      triggerEl.dataset.modalUrl,
      caseModal.querySelector(".loading-icon")
    ).then(() => {
      caseModal
        .querySelectorAll(
          '.project-block-static .project-block-static__wrapper [js-modal-open][data-modal-name="caseModal"]'
        )
        .forEach((el) => {
          el.addEventListener("click", (e) => {
            openModalInit({
              sel: '[js-modal-open][data-modal-name="caseModal"][data-modal-url]',
              beforeOpen: beforeCaseModalOpen,
            });
            beforeCaseModalOpen(e.currentTarget);
          });
        });
      const slider = caseModal.querySelector(".project-block-static")
      if (isMobile && slider) {
        // console.log(slider)
        new Swiper(slider, {
          wrapperClass: "swiper-wrapper",
          slideClass: "swiper-slide",
          // spaceBetween: 100,
          breakpoints: {
            200: {
              slidesPerView: 1.75,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 4,
            },
          },

          on: {
            resize: function () {
              if (!isMobile()) {
                this.destroy(false, true);
              }
            },
          },
        });
      }
      caseModal.scrollTo(0, 0);
    });
  } else {
    console.warn("there is no case modal on page");
  }
}
function afterCaseModalOpen(triggerEl, modal) {
  const caseModal = window.modals["caseModal"];
  const caseModalEl = caseModal?.el;
  if (caseModal) {
    const caseModalTop = document.querySelector(
      ".modal.case-modal .modal__top"
    );
    const cmi = document.querySelector(".modal.case-modal .modal__inner");
    const cmth = caseModalTop.getBoundingClientRect().height * -1;

    const observer = new IntersectionObserver(
      ([e]) => {
        caseModalEl.classList.toggle("_sticked", e.intersectionRatio < 1);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [1],
      }
    );
    caseModal.observer = observer;
    caseModal.observer.observe(caseModalTop);
  }
}
function afterCaseModalClose(triggerEl, modal) {
  window.modals["caseModal"].observer.disconnect();
  window.modals["caseModal"].observer = undefined;
}
function validateForms(selector, rules) {
  const form = document?.querySelector(selector);
  const telSelector = form?.querySelector('input[type="tel"]');
  const mailSelector = form?.querySelector('input[type="email"]');
  const formResponse = form.parentNode.querySelector(".form-response");

  if (!form) {
    console.error("Нет такого селектора!");
    return false;
  }

  if (!rules) {
    console.error("Вы не передали правила валидации!");
    return false;
  }

  function captchaInit(form, cId) {
    if (window.grecaptcha?.render) {
      const rId = window.grecaptcha?.render(cId);
      form.dataset.rId = rId;
      // console.log('renderded captcha: ', rId);
    } else {
      setTimeout(captchaInit, 300, form, cId);
    }
  }
  const captchaId = form.querySelector(".g-recaptcha")?.getAttribute("id");
  if (captchaId) {
    captchaInit(form, captchaId);
  }

  if (telSelector) {
    const inputMask = new Inputmask({
      mask: "+7 (999) 999-99-99",
      showMaskOnHover: false,
    });
    inputMask.mask(telSelector);
    for (let item of rules) {
      if (item.tel) {
        item.rules.push({
          rule: "function",
          validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
          },
          errorMessage: item.telError,
        });
      }
    }
  }
  const validation = new JustValidate(selector, {
    errorLabelCssClass: "error-field__error",
    errorLabelStyle: {},
    errorsContainer: document.querySelector(".error-field"),
    errorFieldCssClass: "has-error",
    successFieldCssClass: "is-valid",
  });

  validation.setCurrentLocale("ru");

  for (let item of rules) {
    validation.addField(item.ruleSelector, item.rules);
  }
  function clearForm() {
    form.reset();
    form
      .querySelector(".form-switch")
      ?.querySelectorAll(".form-switch__option")
      .forEach((el) => {
        el.classList.remove("active");
      });
    form.querySelectorAll(".ui-input").forEach((el) => {
      el.classList.remove("is-focused");
    });
    form.querySelector("span.textarea").textContent = "";
  }

  validation.onSuccess(async (e) => {
    let captcha;
    const captchaId = form.dataset.rId;
    if (captchaId) {
      grecaptcha.execute(captchaId);
    } else {
      console.error("there is no captcha in form");
    }
    const interval = setInterval(function () {
      if (grecaptcha.getResponse(captchaId)) {
        clearInterval(interval);
        const data = new FormData(e.target);
        const url = e.target.getAttribute("action");

        data.append(
          "productType",
          getSwitch(e.target.querySelector(".form-switch"))
        );
        data.append(
          "productDescription",
          e.target.querySelector("span.textarea")?.textContent
        );

        form.classList.add("loading");
        fetch(url, {
          method: "POST",
          body: data,
        }).then(async (response) => {
          if (!response.ok) {
            response
              .json()
              .catch(() => {
                formResponse.textContent = "Что-то пошло не так";
                form.classList.add("hidden");
                form.classList.remove("loading");
                throw new Error(response.status);
              })
              .then(({ message }) => {
                throw new Error(message || response.status);
              });
            clearForm();
          } else {
            const responseData = await response.json();
            formResponse.textContent =
              responseData.message || "Спасибо за заявку";
            form.classList.add("hidden");
            form.classList.remove("loading");
            // response.json()
          }
        });
      }
    }, 1000);
  });
}
