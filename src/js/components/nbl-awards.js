import { isTablet, isDesktop } from '../functions/check-viewport';

if(isDesktop() || isTablet()) {

  const awardsMain = document.querySelector('.nbl-awards')
  const awards = document.querySelectorAll('.nbl-awards .nbl-awards__award-el')

  let awardsPreview = []

  if(awards.length !== 0) {

    fetch(`${awardsMain.dataset.awardsPath}`)
    .then((res) => {
      return res.json()
    })
    .then((result) => {
      result.forEach((el) => {
        awardsPreview.push(el)
      })
    })

    let elementHeight = awards[6].getBoundingClientRect().height

    awards.forEach((el, index) => {
      el.addEventListener('mouseenter', () => {

        let awardCard = el.parentElement.parentElement.parentElement.querySelector('.awards-card')

        if(index < 4) {
          awardCard.style.top = "0"
          awardCard.style.transform = 'translateX(40%)'
        }
        if(index > 3 && index < awardsPreview.length - 4) {
          awardCard.style.top = index * (elementHeight + 12) + elementHeight + 36 + 'px'
          awardCard.style.transform = 'translateX(40%) translateY(-50%)'
        }
        if (index > awardsPreview.length - 4) {
          awardCard.style.top = "auto"
          awardCard.style.bottom = "0"
          awardCard.style.transform = 'translateX(40%)'
        }
  
        awardCard.classList.add('_active')
        awardCard.querySelector('img').setAttribute('src', awardsPreview[index].srcPath)
        
      })
      el.addEventListener('mouseleave', () => {
        let awardCard = el.parentElement.parentElement.parentElement.querySelector('.awards-card')
        awardCard.classList.remove('_active')
      })
    })

  }

}