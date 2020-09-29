import {randomOnGrid} from './general'
import { gridSize } from '../PositionContext'

const wallCheck = (position, upperBound, gridSize) => {
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

export const createWallDimensions = (horizontal, bounds, gridSize) => {
  return horizontal ? {
    width: bounds.width, height: gridSize,
  } : {
    width: gridSize, height: bounds.height,
  }
}

export const applyWall = (bounds, gridSize) => {
  const horizontal = Math.floor(Math.random() * 2)
  const dimensions = createWallDimensions(horizontal, bounds, gridSize)
  const getMinMax = (limit) =>  (bounds[horizontal ? 'height' : 'width'] * limit) / gridSize
  const min = Math.ceil(getMinMax(.25))
  const max = Math.ceil(getMinMax(.75))
  const x = horizontal ? 0 : wallCheck(randomOnGrid(max, min), bounds.width, gridSize)
  const y = !horizontal ? 0 : wallCheck(randomOnGrid(max, min), bounds.height, gridSize)
  const ratio = horizontal ? (y / bounds.height) : (x / bounds.width)
  return {
    position: { x, y },
    dimensions,
    ratio,
    horizontal: dimensions.width > dimensions.height,
  }
}

export const applyWallHole = (wall, gridSize, gridWidthCount, gridHeightCount, bounds) => {
  const coord = randomOnGrid(wall.horizontal ? gridWidthCount : gridHeightCount)
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