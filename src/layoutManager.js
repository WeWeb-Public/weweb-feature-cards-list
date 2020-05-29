const LayoutManager = (container) => {

  const config = {
    horizontalGutter: 48,
    verticalGutter: 48,
    elementWidth: 568,
    elementHeight: 213,
    selectedElementHeight: 473,
    itemsRerRow: 2
  }

  const view = {
    container,
    elements: [],
  }

  const state = {
    isOpened: false,
    selectedIndex: -1,
    initialPositions: [],
  }

  const computeInitialPositions = (elements) => {
    let rowNumber = 0
    let colNumber = 0
    const {horizontalGutter, verticalGutter, elementHeight, elementWidth, itemsRerRow} = config
    return elements.map((el, index) => {
      rowNumber = Math.floor(index / itemsRerRow)
      colNumber = index % itemsRerRow
      return {
        top: (verticalGutter + elementHeight) * rowNumber,
        left: (horizontalGutter + elementWidth) * colNumber
      }
    })
  }

  const computeTranslationsFrom = (initialPositions) => {
    const {horizontalGutter, verticalGutter, elementWidth, elementHeight, selectedElementHeight, itemsRerRow} = config
    const {selectedIndex} = state
    const isSelectedIndexEven = selectedIndex % 2 === 0

    let translateX = 0
    let translateY = 0
    return initialPositions.map((pos, idx) => {
      const isIndexEven = idx % 2 === 0
      if (idx === selectedIndex - 1 && !isSelectedIndexEven) {
        translateX = 0
        translateY = selectedElementHeight + verticalGutter
      } else if (selectedIndex === idx) {
        translateX = (isSelectedIndexEven ? 0 : -1) * (elementWidth + horizontalGutter)
        translateY = 0
      } else if (idx > selectedIndex) {
        translateX = (isIndexEven ? 1 : -1) * (elementWidth + horizontalGutter)
        translateY = (isIndexEven ? elementHeight : selectedElementHeight) + verticalGutter
      }
      return {
        translateX,
        translateY
      }
    })
  }

  const layoutElements = () => {
    const {initialPositions} = state
    const {elements} = view
    requestAnimationFrame(() => {
      elements.forEach((el, index) => {
        const {top, left} = initialPositions[index]
        el.style.top = `${top}px`
        el.style.left = `${left}px`
      })
    })
    state.isOpened = false
  }

  const translateElements = (translations) => {
    const {selectedIndex} = state
    const {elements} = view
    requestAnimationFrame(() => {
      elements.forEach((el, index) => {
        const {translateX, translateY} = translations[index];
        (index === selectedIndex) && el.classList.add('selected')
        el.style.transform = `translate(${translateX}px, ${translateY}px)`
      })
    })
    state.isOpened = true
  }

  const restoreInitialLayout = () => {
    const {selectedIndex} = state
    const {elements} = view
    requestAnimationFrame(() => {
      elements.forEach((el, idx) => {
        el.style.transform = `translate(0px, 0px)`;
        (selectedIndex === idx) && el.classList.remove('selected')
      })
    })
    state.isOpened = false
    state.selectedIndex = -1
  }

  return {
    configure (options) {
      Object.assign(
        config, {
          ...options
        }
      )
    },
    update () {
      view.elements = [...view.container.querySelectorAll('.feature-item')]
      state.initialPositions = computeInitialPositions(view.elements)
      layoutElements()
    },
    toggleItemAt (index) {
      const {selectedIndex, initialPositions, isOpened} = state
      if (isOpened && selectedIndex !== index) return
      if (selectedIndex === index) {
        restoreInitialLayout()
        return
      }
      state.selectedIndex = index
      translateElements(computeTranslationsFrom(initialPositions))
    }
  }
}

export default LayoutManager
