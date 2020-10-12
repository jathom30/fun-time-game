import { randomOnGrid, ratioXY } from './general'
import { gridSize } from '../PositionContext'

const wallCheck = (position, upperBound) => {
  switch (position) {
    case 0:
      return gridSize * 2
    case gridSize: 
      return gridSize * 2
    case upperBound:
      return upperBound - (gridSize * 3)
    case upperBound - gridSize:
      return upperBound - (gridSize * 3)
    case upperBound - (gridSize * 2):
      return upperBound - (gridSize * 3)
    default:
      return position
  }
}

export const createWallDimensions = (horizontal, bounds) => {
  return horizontal ? {
    width: bounds.width, height: gridSize,
  } : {
    width: gridSize, height: bounds.height,
  }
}

export const applyWall = (bounds) => {
  const horizontal = Math.floor(Math.random() * 2)
  const dimensions = createWallDimensions(horizontal, bounds)
  const getMinMax = (limit) =>  (bounds[horizontal ? 'height' : 'width'] * limit) / gridSize
  const min = Math.ceil(getMinMax(.25))
  const max = Math.ceil(getMinMax(.5))
  const x = horizontal ? 0 : wallCheck(randomOnGrid(max, min), bounds.width)
  const y = !horizontal ? 0 : wallCheck(randomOnGrid(max, min), bounds.height)
  const ratio = horizontal ? (y / bounds.height) : (x / bounds.width)
  return {
    position: { x, y },
    dimensions,
    ratio,
    horizontal: dimensions.width > dimensions.height,
  }
}

export const applyWallHole = (wall, bounds, hero, opposite) => {
  console.log(hero, opposite)
  // if horizontal: min: hero or opposite x min, max: hero or opposite x max
  const min = (axis) => hero.position[axis] <= opposite.position[axis] ? hero.position[axis] : opposite.position[axis]
  const max = (axis) => hero.position[axis] >= opposite.position[axis] ? hero.position[axis] : opposite.position[axis]
  const coord = randomOnGrid(max(wall.horizontal ? 'x' : 'y') / gridSize, min(wall.horizontal ? 'x' : 'y') / gridSize)
  const position = wall.horizontal ? {
    x: coord, y: wall.position.y,
  } : {
    x: wall.position.x, y: coord
  }
  const ratio = coord / (wall.horizontal ? bounds.width : bounds.height)

  return {
    position,
    ratio,
  }
}

export const applySecondaryWall = (wall, wallHole, bounds) => {
  console.log(wall, wallHole, bounds)
  const width = wall.horizontal ? gridSize : wall.position.x
  const height = !wall.horizontal ? gridSize : wall.position.y
  if (wall.horizontal) {
    const y = wall.position.y
    const x = randomOnGrid(bounds.width / gridSize)
    const ratio = ratioXY({x, y}, bounds)
    return {
      position: {x, y},
      dimensions: {width, height},
      ratio,
      horizontal: false,
    }
  } else {
    const x = wall.position.x
    const y = randomOnGrid(bounds.height / gridSize)
    const ratio = ratioXY({x, y}, bounds)
    return {
      position: {x, y},
      dimensions: {width, height},
      ratio,
      horizontal: true,
    }
  }
}

export const getClippingCoords = (wall) => {
  const yUnits = wall.dimensions.height / gridSize
  const xUnits = wall.dimensions.width / gridSize
  const yVoids = Array.from({length: yUnits}, (v, i) => i).map(u => u * gridSize + wall.position.y)
  const xVoids = Array.from({length: xUnits}, (v, i) => i).map(u => u * gridSize + wall.position.x)
  const voidCoords = yVoids.map(y => {
    return xVoids.map(x => {
      return {
        x, y
      }
    })
  }).flat()
  return voidCoords
}