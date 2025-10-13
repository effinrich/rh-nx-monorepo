export const SCROLL_CONTAINER_ID = 'scrollContainer'

export const scrollToTop = (scrollContainerId: string) => {
  document.getElementById(scrollContainerId)?.scroll({
    top: 0
  })
}
