export const randomOnGrid = (gridSize, max, min = 0) => (Math.floor(Math.random() * (max - min)) + min) * gridSize

export const ratioXY = (position, bounds) => {
  return {
    x: position.x / bounds.width,
    y: position.y / bounds.height
  }
}

export const findRatioLocation = (length, ratio, gridSize) => 
  Math.floor(length * ratio / gridSize) * gridSize

export const setLocationOnRatio = (prevItem, width, height, gridSize) => ({
  ...prevItem,
  position: {
    x: findRatioLocation(width, prevItem.ratio.x, gridSize),
    y: findRatioLocation(height, prevItem.ratio.y, gridSize),
  }
})