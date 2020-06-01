const LayoutManager = (container) => {

  const options = {
    mobile: {
      verticalGutter: 16,
      horizontalGutter: 0,
      elementHeight: 180,
      selectedElementHeight: 575,
      itemsPerRow: 1,
    },
    desktop: {
      horizontalGutter: 48,
      verticalGutter: 48,
      elementWidth: 568,
      elementHeight: 213,
      selectedElementHeight: 473,
      itemsPerRow: 2
    }
  }

  const config = {}

  const view = {
    container,
    elements: [],
    isMobile: false,
  }

  const state = {
    isOpened: false,
    selectedIndex: -1,
    initialPositions: [],
  }

  const computeInitialPositions = (elements) => {
    let rowNumber = 0
    let colNumber = 0
    const {horizontalGutter, verticalGutter, elementHeight, elementWidth, itemsPerRow} = config
    return elements.map((el, index) => {
      rowNumber = Math.floor(index / itemsPerRow)
      colNumber = index % itemsPerRow
      return {
        top: (verticalGutter + elementHeight) * rowNumber,
        left: (horizontalGutter + elementWidth) * colNumber
      }
    })
  }

  const computeTranslationsForDesktop = (initialPositions) => {
    const {horizontalGutter, verticalGutter, elementWidth, elementHeight, selectedElementHeight} = config
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

  const computeTranslationsForMobile = (initialPositions) => {
    const {selectedElementHeight, elementHeight} = config
    const {selectedIndex} = state
    return initialPositions.map((pos, idx) => {
      return {
        translateX: 0,
        translateY: idx > selectedIndex ? selectedElementHeight - elementHeight : 0
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
        el.style.transform = 'translate(0px, 0px)';
        (selectedIndex === idx) && el.classList.remove('selected')
      })
    })
    state.isOpened = false
    state.selectedIndex = -1
  }

  return {
    configure (isMobile) {
      const {desktop, mobile} = options
      Object.assign(
        config, isMobile ? mobile : desktop
      )
      view.isMobile = isMobile
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
      const computeTranslationsFn = view.isMobile ? computeTranslationsForMobile : computeTranslationsForDesktop
      translateElements(computeTranslationsFn(initialPositions))
    }
  }
}

export default LayoutManager
