
function filterInit() {
  if (document.querySelector(".blog-filter-block__tags-container")) {
    
    function filterItems(tag, items) {
      // const itemsToShow = []
      items.forEach((el) => {
        if (el.dataset?.postFilterTags && el.dataset?.postFilterTags !== 'false') {
          if (JSON.parse(el.dataset?.postFilterTags).includes(tag)) {
            el.classList.add('_visible')
          }
          else {
            el.classList.remove('_visible')
          }
        }
      })
    }
    
    const tags = document.querySelectorAll(".blog-filter-block__tag")

    tags[0].classList.add('_active')
    filterItems(tags[0]?.dataset?.postFilterTagName, document.querySelectorAll(".blog-posts-item"))
    
    tags.forEach((el) => {
      el.addEventListener('click', (e) => {
        tags.forEach((el) => {
          el.classList.remove('_active')
        })
        e.currentTarget.classList.add('_active')
        filterItems(e.currentTarget.dataset?.postFilterTagName, document.querySelectorAll(".blog-posts-item"))

      })
    })
  }
}
filterInit()