// export const getHeaderHeight = () => {
//   const headerHeight = document?.querySelector('.header-inner').offsetHeight;
//   document.querySelector(':root').style.setProperty('--headerHeight', `${headerHeight}px`);
// }

export const getHeaderHeight = () => {
  const headerHeight = document?.querySelector('.nbl-header ').offsetHeight;
  document.querySelector(':root').style.setProperty('--headerHeight', `${headerHeight}px`);
}
