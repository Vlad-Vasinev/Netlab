let banner = document.querySelector('.main-page-banner')
if(banner){
  const scrollTop = banner.getBoundingClientRect().bottom - 16
  banner.querySelector('.main-page-banner__scroll-button')?.addEventListener('click', (e) => {
    scrollTo({
      top: scrollTop,
      behavior: "smooth"
    })
    
  })
}