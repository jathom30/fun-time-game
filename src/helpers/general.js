import { gridSize } from '../PositionContext'

export const randomOnGrid = (max, min = 0) => (Math.floor(Math.random() * (max - min)) + min) * gridSize

export const ratioXY = (position, bounds) => {
  return {
    x: position.x / bounds.width,
    y: position.y / bounds.height
  }
}

export const findRatioLocation = (length, ratio) => 
  Math.floor(length * ratio / gridSize) * gridSize

export const setLocationOnRatio = (prevItem, width, height, wall, hero) => {

  const x = findRatioLocation(width, prevItem.ratio.x)
  const y = findRatioLocation(height, prevItem.ratio.y)
  const findCoord = (axis, variable) => {
    if (variable === wall.position[axis]) {
      if (hero) {
        return(variable - gridSize) < 0 ? 0 : (variable - gridSize)
      } else {
        // check for past wall (is an additional test needed?)
        return (variable + gridSize) 
      }
    } else {
      return variable
    }
  }
  return {
  ...prevItem,
  position: { 
    x: findCoord('x', x),
    y: findCoord('y', y)
  },
}}

export const sameSpaceCheck = (first, second) => 
  first.position.x === second.position.x && first.position.y === second.position.y