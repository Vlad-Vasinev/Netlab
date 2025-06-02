
import { isDesktop } from '../functions/check-viewport'

if(isDesktop()) {
  let clipPopups = document.querySelectorAll('.nbl-clipPopup.dp')

  if(clipPopups.length !== 0) {
    clipPopups.forEach((el) => {
      let popupWidth = (-el.getBoundingClientRect().width / 2) + el.parentElement.getBoundingClientRect().width / 2 + "px"
      el.style.setProperty('--popup-width', popupWidth)
    })
  }
}