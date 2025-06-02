
/**
 * 
 */
async function openBannerModal() {
  if (!appConfig.showPopupBanner || sessionStorage.getItem("bannerShown"))
    return;
  const timeout = (appConfig.showPopupBannerTimeout || 1) * 1000;
  const openPopup = () => {
    if (window.activeModal) {
      setTimeout(openPopup, timeout);
      return;
    }
    openModal(undefined, document.querySelector('.modal[data-modal-name="tgPopup"]'))
    sessionStorage.setItem("bannerShown", "true");
  };
  setTimeout(openPopup, timeout);
}
//openBannerModal()