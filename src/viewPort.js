export const getViewPortInfos = (window) => {
  const {document} = window
  const {documentElement, body} = document
  const width = window.innerWidth || documentElement.clientWidth || body.clientWidth
  const height = window.innerHeight || documentElement.clientHeight || body.clientHeight
  return {
    height,
    width,
    isMobile: width <= 1024
  }
}
