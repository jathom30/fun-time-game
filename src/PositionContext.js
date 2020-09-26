import React, { useState, useLayoutEffect, useEffect } from 'react'
import { 
  randomOnGrid, 
  applyWallHole, 
  applyWall, 
  createWallDimensions, 
  ratioXY, 
  findRatioLocation,
  setLocationOnRatio,
} from './helpers'

const gridSize = 60
document.documentElement.style.setProperty('--height', gridSize/2+'px')

export const PositionContext = React.createContext({})
export const PositionContextProvider = ({ children }) => {
  const [win, setWin] = useState(false)
    const [wall, setWall] = useState({
      position: {},
      dimensions: {},
      ratio: 0,
      horizontal: true,
    })
  const [wallHole, setWallHole] = useState({
    position: {},
    ratio: 0,
  })
  const [hero, setHero] = useState({
    position: {x:0,y:0},
    ratio: {},
    hasItem: false,
  })
  const [heroItem, setHeroItem] = useState({
    position: {x:1,y:1},
    ratio: {},
  }) 
  const [heroGoal, setHeroGoal] = useState({
    position: {},
    ratio: {},
  })

  const [opposite, setOpposite] = useState({
    position: {x:0,y:0},
    ratio: {},
    hasItem: false,
  })
  const [oppositeItem, setOppositeItem] = useState({
    position: {x:1,y:1},
    ratio: {},
  }) 
  const [oppositeGoal, setOppositeGoal] = useState({
    position: {},
    ratio: {},
  })

  // movement related state
  const [canMove, setCanMove] = useState(true)

  const [bounds, setBounds] = useState({
    width: Math.floor(document.documentElement.clientWidth / gridSize) * gridSize,
    height: Math.floor(document.documentElement.clientHeight / gridSize) * gridSize,
  })
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])

  const gridHeightCount = bounds.height / gridSize
  const gridWidthCount = bounds.width / gridSize

  const generateSpace = (heroSide, wall) => {
    if (heroSide) {
      return wall.horizontal ? {
        x: randomOnGrid(gridSize, gridWidthCount),
        y: randomOnGrid(gridSize, wall.position.y / gridSize)
      } : {
        x: randomOnGrid(gridSize, wall.position.x / gridSize),
        y: randomOnGrid(gridSize, gridHeightCount)
      }
    } else {
      const x = randomOnGrid(gridSize, gridWidthCount, (wall.position.x / gridSize))
      const y = randomOnGrid(gridSize, gridHeightCount, (wall.position.y / gridSize))
      return wall.horizontal ? {
        x: randomOnGrid(gridSize, gridWidthCount),
        y: y === wall.position.y ? y + gridSize : y
      } : {
        x: x === wall.position.x ? x + gridSize : x,
        y: randomOnGrid(gridSize, gridHeightCount)
      }
    }
  }

  const checkSpace = (item, dontBeHeres) => 
    dontBeHeres.some(location => location.x === item.x && location.y === item.y)

  const applyCharacter = (heroSide, wall) => {
    const position = generateSpace(heroSide, wall)
    return {
      position,
      ratio: ratioXY(position, bounds),
      hasItem: false,
    }
  }

  const applyItem = (heroSide, wall, spaceChecks) => {
    const position = () => generateSpace(heroSide, wall)
    const ogPosition = position()
    const finalPosition = checkSpace(position(), spaceChecks) ? position() : ogPosition
    return {
      position: finalPosition,
      ratio: ratioXY(finalPosition, bounds),
    }
  }

  // game board setup
  useLayoutEffect(() => {
    const wall = applyWall(bounds, gridSize, gridWidthCount, gridHeightCount)
    setWall(wall)
    const wallHole = applyWallHole(wall, gridSize, gridWidthCount, gridHeightCount, bounds)
    setWallHole(wallHole)
    const hero = applyCharacter(true, wall)
    setHero(hero)
    const heroItem = applyItem(true, wall, [hero])
    setHeroItem(heroItem)
    const opposite = applyCharacter(false, wall)
    setOpposite(opposite)
    const oppositeItem = applyItem(false, wall, [opposite])
    setOppositeItem(oppositeItem)
    const heroGoal = applyItem(false, wall, [opposite, oppositeItem])
    setHeroGoal(heroGoal)
    const oppositeGoal = applyItem(true, wall, [hero, heroItem])
    setOppositeGoal(oppositeGoal)
  },[])

  // update bounds and item positions on resize
  useEffect(() => {
    const resize = () => {
      const minDim = gridSize * 7
      const width = Math.floor(window.innerWidth / gridSize) * gridSize
      const height = Math.floor(window.innerHeight / gridSize) * gridSize
      const bounds = {
        width: width < minDim ? minDim : width,
        height: height < minDim ? minDim : height,
      }
      setBounds(bounds)
      const wallX = findRatioLocation(width, wall.ratio, gridSize)
      const wallY = findRatioLocation(height,wall.ratio, gridSize)
      const keepWallFromEdge = (horizontal, space) => {
        const direction = horizontal ? 'height' : 'width'
        if (space === bounds[direction] || space === bounds[direction] - gridSize || space === bounds[direction] - gridSize * 2) {
          return bounds[direction] - gridSize * 3
        } else if (space === 0 || space === gridSize) {
          return gridSize * 2
        } else {
          return space
        }
      }
      setWall(prevWall => ({
        ...prevWall,
        position: {
          x: !prevWall.horizontal ? keepWallFromEdge(false, wallX)  : prevWall.position.x,
          y: prevWall.horizontal ? keepWallFromEdge(true, wallY) : prevWall.position.y,
        },
        dimensions: createWallDimensions(prevWall.horizontal, bounds, gridSize)
      }))
      setWallHole(prevHole => ({
        ...prevHole,
        position: {
          x: wall.horizontal ? findRatioLocation(width, prevHole.ratio, gridSize) : keepWallFromEdge(false, wallX),
          y: !wall.horizontal ? findRatioLocation(height, prevHole.ratio, gridSize) : keepWallFromEdge(true, wallY),
        }
      }))
      setHero(prev => setLocationOnRatio(prev, width, height, gridSize, wall, true))
      setHeroItem(prev => setLocationOnRatio(prev, width, height, gridSize, wall, true))
      setHeroGoal(prev => setLocationOnRatio(prev, width, height, gridSize, wall, false))
      setOpposite(prev => setLocationOnRatio(prev, width, height, gridSize, wall, false))
      setOppositeItem(prev => setLocationOnRatio(prev, width, height, gridSize, wall, false))
      setOppositeGoal(prev => setLocationOnRatio(prev, width, height, gridSize, wall, true))
    }

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [wall.position])

  // Get clipping coords
  useEffect(() => {
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
    .filter(coord => !(coord.x === wallHole.position.x && coord.y === wallHole.position.y))
    setVoidPositions(voidCoords)
  }, [wall, wallHole])

  // move player
  useEffect(() => {
    const move = (e) => {
      const checkMove = (key) => {
        switch (key) {
          case 'w':
            return voidPositions.some(xy => xy.y === hero.position.y - gridSize && xy.x === hero.position.x)
          case 's':
            return voidPositions.some(xy => xy.y === hero.position.y + gridSize && xy.x === hero.position.x)
          case 'a':
            return voidPositions.some(xy => xy.x === hero.position.x - gridSize && xy.y === hero.position.y)
          case 'd':
            return voidPositions.some(xy => xy.x === hero.position.x + gridSize && xy.y === hero.position.y)
          default:
            return true
        }
      }
      const checkOppositeMove = (key) => {
        switch (key) {
          case 'w':
            return voidPositions.some(xy => xy.y === opposite.position.y + gridSize && xy.x === opposite.position.x)
          case 's':
            return voidPositions.some(xy => xy.y === (opposite.position.y - gridSize) && xy.x === opposite.position.x)
          case 'a':
            return voidPositions.some(xy => xy.x === opposite.position.x + gridSize && xy.y === opposite.position.y)
          case 'd':
            return voidPositions.some(xy => xy.x === opposite.position.x - gridSize && xy.y === opposite.position.y)
          default:
            return true
        }
      }

      switch (e.key) {
        case 'w':
          setHero(prev => {
            const y = prev.position.y >= gridSize && !checkMove(e.key) ? prev.position.y - gridSize : prev.position.y
            return {
            ...prev,
            position: {
              ...prev.position,
              y
            },
            ratio: {
              x: prev.position.x / bounds.width,
              y: y / bounds.height,
            }
          }})
          setOpposite(prev => {
            const y = (prev.position.y + (gridSize * 2)) <= bounds.height && !checkOppositeMove(e.key) ? prev.position.y + gridSize : prev.position.y
            return {
            ...prev,
            position: {
              ...prev.position,
              y
            },
            ratio: {
              x: prev.position.x / bounds.width,
              y: y / bounds.height,
            }
          }})
          break
        case 's':
          setHero(prev => {
            const y = prev.position.y <= bounds.height - (gridSize * 2) && !checkMove(e.key) ? prev.position.y + gridSize : prev.position.y
            return {
            ...prev,
            position: {
              ...prev.position,
              y
            },
            ratio: {
              x: prev.ratio.x,
              y: y / bounds.height
            }
          }})
          setOpposite(prev => {
            const y = prev.position.y >= gridSize && !checkOppositeMove(e.key) ? prev.position.y - gridSize : prev.position.y
            return {
            ...prev,
            position: {
              ...prev.position,
              y
            },
            ratio: {
              x: prev.ratio.x,
              y: y / bounds.height
            }
          }})
          break
        case 'a':
          setHero(prev => {
            const x = prev.position.x >= gridSize && !checkMove(e.key) ? prev.position.x - gridSize : prev.position.x
            return {
            ...prev,
            position: {
              ...prev.position,
              x
            },
            ratio: {
              x: x / bounds.width,
              y: prev.ratio.y,
            }
          }})
          setOpposite(prev => {
            const x = prev.position.x <= bounds.width - (gridSize * 2) && !checkOppositeMove(e.key) ? prev.position.x + gridSize : prev.position.x
            return {
            ...prev,
            position: {
              ...prev.position,
              x
            },
            ratio: {
              x: x / bounds.width,
              y: prev.ratio.y
            }
          }})
          break
        case 'd':
          setHero(prev => {
            const x = prev.position.x <= bounds.width - (gridSize * 2) && !checkMove(e.key) ? prev.position.x + gridSize : prev.position.x
            return {
            ...prev,
            position: {
              ...prev.position,
              x
            },
            ratio: {
              x: x / bounds.width,
              y: prev.ratio.y
            }
          }})
          setOpposite(prev => {
            const x = prev.position.x >= gridSize && !checkOppositeMove(e.key) ? prev.position.x - gridSize : prev.position.x
            return {
            ...prev,
            position: {
              ...prev.position,
              x
            },
            ratio: {
              x: x / bounds.width,
              y: prev.ratio.y
            }
          }})
          break
        default: 
          break
      }
    }
    
    const handleMove = e => {
      canMove && move(e)
      setCanMove(false)
      setTimeout(() => setCanMove(true), 200)
    }
    
    document.addEventListener('keypress', handleMove)
    return () => document.removeEventListener('keypress', handleMove)
  },[canMove])

  // hero and opposite get bombs
  useEffect(() => {
    if (hero.position.x === heroItem.position.x && hero.position.y === heroItem.position.y) setHero(prev => ({...prev, hasItem: true}))
    if (opposite.position.x === oppositeItem.position.x && opposite.position.y === oppositeItem.position.y) setOpposite(prev => ({...prev, hasItem: true}))
  },[hero, opposite])

  useEffect(() => {
    if (hero.position.x === heroGoal.position.x && hero.position.y === heroGoal.position.y && opposite.position.x === oppositeGoal.position.x && opposite.position.y === oppositeGoal.position.y) {
      setCanMove(false)
      setTimeout(() => {
        setWin(true)
      },500)
    }
  },[hero, opposite])

  return (
    <PositionContext.Provider
      value={{
        win,
        wall,
        wallHole,
        hero,
        heroItem,
        heroGoal,

        opposite,
        oppositeItem,
        oppositeGoal,

        canMove,
        bounds
      }}
    >
      {children}
    </PositionContext.Provider>
  )
}