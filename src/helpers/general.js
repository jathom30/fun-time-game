export const randomOnGrid = (gridSize, max, min = 0) => (Math.floor(Math.random() * (max - min)) + min) * gridSize

export const ratioXY = (position, bounds) => {
  return {
    x: position.x / bounds.width,
    y: position.y / bounds.height
  }
}

export const findRatioLocation = (length, ratio, gridSize) => 
  Math.floor(length * ratio / gridSize) * gridSize

export const setLocationOnRatio = (prevItem, width, height, gridSize, wall, hero) => {
  const x = findRatioLocation(width, prevItem.ratio.x, gridSize)
  const y = findRatioLocation(height, prevItem.ratio.y, gridSize)
  return {
  ...prevItem,
  position: { 
    // if position is from hero side keep on hero side or visa versa
    x: x === wall.position.x ? hero ? x - gridSize : x + gridSize : x,
    y: y === wall.position.y ? hero ? y - gridSize : y + gridSize : y
  },
}}