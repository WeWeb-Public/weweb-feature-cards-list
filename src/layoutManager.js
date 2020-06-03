const LayoutManager = (container) => {

  const options = {
    mobile: {
      verticalGutter: 16,
      horizontalGutter: 0,
      elementHeight: 180,
      selectedElementHeight: 575,
      itemsPerRow: 1,
    },
    labTop: {
      horizontalGutter: 32,
      verticalGutter: 48,
      elementWidth: 530,
      elementHeight: 213,
      selectedElementHeight: 473,
      itemsPerRow: 2
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
    kind: ''
  }

  const state = {
    isOpened: false,
    selectedIndex: -1,
    positions: [],
  }

  const computeViewKind = (screenSize) => {
    return screenSize === 'xs' || screenSize === 'sm' ? 'mobile' : screenSize === 'md' ? 'labTop' : 'desktop'
  }

  const computePositions = (elements) => {
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

  const toDesktopTranslations = (positions, selectedIndex) => {
    const {horizontalGutter, verticalGutter, elementWidth, elementHeight, selectedElementHeight} = config
    const isSelectedIndexEven = selectedIndex % 2 === 0

    let translateX = 0
    let translateY = 0
    return positions.map((pos, idx) => {
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

  const toMobileTranslations = (positions, selectedIndex) => {
    const {selectedElementHeight, elementHeight} = config
    return positions.map((pos, idx) => {
      return {
        translateX: 0,
        translateY: idx > selectedIndex ? selectedElementHeight - elementHeight : 0
      }
    })
  }

  const layout = (elements, positions) => {
    requestAnimationFrame(() => {
      elements.forEach((el, index) => {
        const {top, left} = positions[index]
        el.style.top = `${top}px`
        el.style.left = `${left}px`
      })
    })
  }

  const translate = (elements, translations) => {
    requestAnimationFrame(() => {
      elements.forEach((el, index) => {
        const {translateX, translateY} = translations[index]
        el.style.transform = `translate(${translateX}px, ${translateY}px)`
      })
    })
  }

  const restore = (elements) => {
    requestAnimationFrame(() => {
      elements.forEach((el, idx) => el.style.transform = 'translate(0px, 0px)')
    })

  }

  return {
    configure(screenSize) {
      view.kind = computeViewKind(screenSize)
      Object.assign(
          config, options[view.kind]
      )
    },
    update() {
      view.elements = [...view.container.querySelectorAll('li')]
      state.positions = computePositions(view.elements)
      layout(view.elements, state.positions)
      state.isOpened = false
    },

    needUpdate(screenSize) {
      view.kind = computeViewKind(screenSize)
      return screenSize !== view.kind
    },

    toggleItemAt(index) {
      const {selectedIndex, positions, isOpened} = state
      const {kind, elements} = view
      if (isOpened && selectedIndex !== index) return
      if (selectedIndex === index) {
        restore(elements)
        state.isOpened = false
        state.selectedIndex = -1
        return
      }
      const translationsFn = kind === 'mobile' ? toMobileTranslations : toDesktopTranslations
      translate(elements, translationsFn(positions, index))
      state.selectedIndex = index
      state.isOpened = true
    },
    restore: () => {
      restore(view.elements)
    }
  }
}

export default LayoutManager
