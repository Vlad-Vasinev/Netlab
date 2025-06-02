
let btnNextBlock = document.querySelector('.nbl-nextBlock')
let nblNextBlock = document.querySelector('.page-container .nbl-bigBlock')

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      btnNextBlock.classList.add('_active')
    }
    else {
      btnNextBlock.classList.remove('_active')
    }
  });
}, {
  threshold: 0.1
});

if(btnNextBlock) {

  observer.observe(nblNextBlock)

  btnNextBlock.addEventListener('click', () => {
    nblNextBlock.scrollIntoView({
      behavior: "smooth"
    })
  })
}
