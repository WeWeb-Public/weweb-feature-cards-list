const LayoutManager = (container) => {

  const options = {
    phone: {
      verticalGutter: 16,
      horizontalGutter: 0,
      elementHeight: 180,
      selectedElementHeight: 575,
      itemsPerRow: 1,
    },
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
      elementWidth: 438,
      elementHeight: 213,
      selectedElementHeight: 473,
      itemsPerRow: 2
    },
    desktop: {
      horizontalGutter: 48,
      verticalGutter: 48,
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
    containerHeight: 0,
    selectedIndex: -1,
    positions: [],
  }

  const computeViewKind = (screenSize) => {
    return screenSize === 'xs' ? 'phone' : screenSize === 'sm' ? 'mobile' : screenSize === 'md' ? 'labTop' : 'desktop'
  }

  const computePositions = (elements, computedElementWidth = 0) => {
    let rowNumber = 0
    let colNumber = 0
    const {horizontalGutter, verticalGutter, elementHeight, elementWidth, itemsPerRow} = config
    const overriddenElementWidth = computedElementWidth > 0 ? computedElementWidth : elementWidth
    return elements.map((el, index) => {
      rowNumber = Math.floor(index / itemsPerRow)
      colNumber = index % itemsPerRow
      return {
        top: (verticalGutter + elementHeight) * rowNumber,
        left: (horizontalGutter + overriddenElementWidth) * colNumber,
        width: overriddenElementWidth
      }
    })
  }

  const toDesktopTranslations = (positions, selectedIndex) => {
    const {horizontalGutter, verticalGutter, elementHeight, selectedElementHeight} = config
    const isSelectedIndexEven = selectedIndex % 2 === 0
    let translateX = 0
    let translateY = 0
    return positions.map((pos, idx) => {
      const isIndexEven = idx % 2 === 0
      const computeElementWidth = pos.width
      if (idx === selectedIndex - 1 && !isSelectedIndexEven) {
        translateX = 0
        translateY = selectedElementHeight + verticalGutter
      } else if (selectedIndex === idx) {
        translateX = (isSelectedIndexEven ? 0 : -1) * (computeElementWidth + horizontalGutter)
        translateY = 0
      } else if (idx > selectedIndex) {
        translateX = (isIndexEven ? 1 : -1) * (computeElementWidth + horizontalGutter)
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
      const {elementHeight, verticalGutter, itemsPerRow} = config
      let numRow = 0
      elements.forEach((el, idx) => {
        const {top, left, width} = positions[idx]
        el.style.top = `${top}px`
        el.style.left = `${left}px`
        el.style.width = `${width}px`
        numRow = Math.floor(idx / itemsPerRow)
      })
      state.containerHeight = (numRow + 1) * (elementHeight + verticalGutter)
      container.style.height = `${state.containerHeight}px`
    })
  }

  const translate = (elements, translations) => {
    const {elementHeight, selectedElementHeight, verticalGutter, itemsPerRow} = config
    requestAnimationFrame(() => {
      elements.forEach((el, index) => {
        const {translateX, translateY} = translations[index]
        el.style.transform = `translate(${translateX}px, ${translateY}px)`
        if (index === state.selectedIndex) el.style.width = `100%`
      })
      const factor = elements.length % itemsPerRow === 0 ? 1 : 0
      container.style.height = `${state.containerHeight + (selectedElementHeight - elementHeight) + factor * (elementHeight + verticalGutter)}px`

    })
  }

  const restore = (elements, positions) => {
    requestAnimationFrame(() => {
      elements.forEach((el, idx) => {
        el.style.transform = 'translate(0px, 0px)'
        el.style.width = `${positions[idx].width}px`
      })

      container.style.height = `${state.containerHeight}px`
    })
  }

  return {
    configure (screenSize) {
      view.kind = computeViewKind(screenSize)
      Object.assign(
        config, options[view.kind]
      )
    },
    update () {
      view.elements = [...view.container.querySelectorAll('li')]
      let computedElementWidth = 0
      const clientWidth = window.innerWidth || document.documentElement.clientWidth ||
        document.body.clientWidth
      if (view.kind === 'desktop') {
        computedElementWidth = clientWidth * 0.70 * 0.5 - 24
      } else if (view.kind === 'labTop') {
        computedElementWidth = clientWidth * 0.8 * 0.5 - 16
      } else if (view.kind === 'mobile') {
        computedElementWidth = clientWidth * 0.8
      } else if (view.kind === 'phone') {
        computedElementWidth = clientWidth * 0.9
      }

      state.positions = computePositions(view.elements, computedElementWidth)
      layout(view.elements, state.positions)
    },

    needUpdate (screenSize) {
      view.kind = computeViewKind(screenSize)
      return screenSize !== view.kind
    },

    expandItemAt (index) {
      const {positions} = state
      const {kind, elements} = view
      const translationsFn = ['phone', 'mobile'].includes(kind) ? toMobileTranslations : toDesktopTranslations
      translate(elements, translationsFn(positions, index))
      state.selectedIndex = index
    },
    restore: () => {
      restore(view.elements, state.positions)
    }
  }
}

export default LayoutManager
