export function unwrapTpl(tpl){
  const result = tpl.content.firstElementChild.cloneNode(true)
  if(!result){
    console.log('template unwrap failed', tpl);
    return null
  }
  return tpl.content.firstElementChild.cloneNode(true) || null
}