import { NetlabBanner } from "./NetlabBanner";

initNetlabBanner(document.querySelector(".banner-3d"));

function initNetlabBanner(container) {
  if (!container) {
    return;
  }
  const imgSrc = isMobile() ? container.dataset.srcsetMob.trim().split(', ') : container.dataset.srcset.trim().split(', ')
  
  const bannerOptions = {
    transmission: 1,
    thickness: 2.5,
    roughness: 0,
    reflectivity: 0.45,
    opacity: 1,

    CameraX: 0,
    CameraY: 0,
    CameraZ: 21,
    BoxSize: 12.5,
    BoxRadius: 1,
    BoxX: 0,
    BoxY: 0,
    BoxZ: isMobile() ? 19 : 3,

    canvasZ: -6,

    cubeSpin: 26000,
    bgSpin: 600,
    bgDelay: 5000,
  };

  window.banner = new NetlabBanner(
    container,
    imgSrc,
    bannerOptions
  );

}
