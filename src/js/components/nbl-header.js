
let nblHeader = document.querySelector('.nbl-header')
let nblHeaderFixed = document.querySelector('.nbl-fixedHeader')
let nblFixedButton = nblHeaderFixed.querySelector('.animated-menu')

let footer = document.querySelector('.nbl-footer')

if(nblHeader && nblHeaderFixed) {
  if(window.innerWidth > 768) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
      let currentScrollTop = window.scrollY;
      if (lastScrollTop <= 44) {
        nblHeader.classList.remove('_active')
        nblHeaderFixed.classList.remove('_active')
        nblHeaderFixed.querySelector('svg').classList.remove('svg-clip')
      }
      if (currentScrollTop > lastScrollTop) {
        nblHeader.classList.add('_active')
        nblHeaderFixed.classList.add('_active')
        nblHeaderFixed.querySelector('svg').classList.add('svg-clip')
      }
      lastScrollTop = currentScrollTop;
    });

    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nblHeaderFixed.querySelector('.nbl-header__logo').classList.add('_active')
          nblFixedButton.classList.add('_active')
        }
        else {
          nblHeaderFixed.querySelector('.nbl-header__logo').classList.remove('_active')
          nblFixedButton.classList.remove('_active')
        }
      });
    }, {
      threshold: 0.9
    });
    
    if(footer) {
      observer.observe(footer)
    }

  }
  if (window.innerWidth <= 768) {
  
    function onScroll() {
      const currentScrollTop = Math.round(window.pageYOffset);
  
      if(currentScrollTop > 90) {
        nblHeader.classList.add('_active')
      }
      if(currentScrollTop < 90) {
        nblHeader.classList.remove('_active')
      }
    }
  
    document.body.addEventListener('touchmove', onScroll);
    window.addEventListener('scroll', onScroll);
  }
  
}