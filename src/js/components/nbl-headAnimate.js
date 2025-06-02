import { eventListeners } from '@popperjs/core';
import { isTablet, isDesktop } from '../functions/check-viewport';

if (isDesktop() || isTablet()) {
  let animateHeader = document.querySelector('.animated-menu')

  let elAnimated = animateHeader.querySelector('.animated-menu__top')
  let elAnimatedWidth = elAnimated.getBoundingClientRect().width + 1 +  "px"
  animateHeader.style.setProperty('--menu-width', elAnimatedWidth)

  let elInner = ""
  let burger = elAnimated.querySelector('.nbl-burger')

  function closeHeader () {
    burger.classList.remove('_active')
    burger.querySelectorAll('.burger-item').forEach(el => {
      el.classList.add('burger-item_active')
    })
    animateHeader.classList.remove('_animate')
  }

  elAnimated.addEventListener('click', () => {
    burger.classList.toggle('_active')
    burger.querySelectorAll('.burger-item').forEach(el => {
      el.classList.toggle('burger-item_active')
    })
    animateHeader.classList.toggle('_animate')
  })

  animateHeader.addEventListener('click', (e) => {

    let target = e.target
    if(!target.classList.contains('animated-menu__link')) return 

    burger.classList.remove('_active')
    burger.querySelectorAll('.burger-item').forEach(el => {
      el.classList.remove('burger-item_active')
    })

    setTimeout(() => {
      let elAnimatedWidth = elAnimated.getBoundingClientRect().width + 1 +  "px"
      animateHeader.style.setProperty('--menu-width', elAnimatedWidth)
    })

    elInner = target.innerHTML
    elAnimated.querySelector('.btn-1').innerHTML = elInner

    animateHeader.classList.remove('_animate')
  })
}
