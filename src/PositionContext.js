import React, { useState, useLayoutEffect, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { 
  randomOnGrid, 
  applyWallHole, 
  applyWall, 
  createWallDimensions, 
  ratioXY, 
  findRatioLocation,
  setLocationOnRatio, 
  sameSpaceCheck
} from './helpers'

export const gridSize = 40
document.documentElement.style.setProperty('--height', gridSize/2+'px')

export const PositionContext = React.createContext({})
export const PositionContextProvider = ({ children }) => {
  const location = useLocation()
  const [reset, setReset] = useState(true)
  const [settings, setSettings] = useState({
    hasItem: false,
    hasHazard: true,
    hasSpark: true,
  })
  const [gameReady, setGameReady] = useState(false)
  const [win, setWin] = useState(false)
  const [lose, setLose] = useState(false)
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
    emoji: '🕵️‍♂️',
  })
  const [heroItem, setHeroItem] = useState({
    position: {x:1,y:1},
    ratio: {},
  }) 
  const [heroGoal, setHeroGoal] = useState({
    position: {},
    ratio: {},
  })
  const [heroHazard, setHeroHazard] = useState({
    position: {x:-1,y:-1},
    ratio: {},
    emoji: '🧟‍♂️',
  })

  const [opposite, setOpposite] = useState({
    position: {x:0,y:0},
    ratio: {},
    hasItem: false,
    emoji: '🕵️‍♀️',
  })
  const [oppositeItem, setOppositeItem] = useState({
    position: {x:1,y:1},
    ratio: {},
  }) 
  const [oppositeGoal, setOppositeGoal] = useState({
    position: {},
    ratio: {},
  })
  const [oppositeHazard, setOppositeHazard] = useState({
    position: {x:-1,y:-1},
    ratio: {},
    emoji: '🧟‍♀️',
  })
  const [spark, setSpark] = useState({
    position: {},
    ratio: {},
    emoji: '⚡️',
    status: 'dormant',
  })

  const [canMove, setCanMove] = useState(true)
  const [bounds, setBounds] = useState({
    width: Math.floor(document.documentElement.clientWidth / gridSize) * gridSize,
    height: Math.floor((document.documentElement.clientHeight - gridSize) / gridSize) * gridSize,
  })
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])

  const gridHeightCount = bounds.height / gridSize
  const gridWidthCount = bounds.width / gridSize

  const generateSpace = (heroSide, wall) => {
    if (heroSide) {
      return wall.horizontal ? {
        x: randomOnGrid(gridWidthCount),
        y: randomOnGrid(wall.position.y / gridSize)
      } : {
        x: randomOnGrid(wall.position.x / gridSize),
        y: randomOnGrid(gridHeightCount)
      }
    } else {
      const x = randomOnGrid(gridWidthCount, (wall.position.x / gridSize))
      const y = randomOnGrid(gridHeightCount, (wall.position.y / gridSize))
      return wall.horizontal ? {
        x: randomOnGrid(gridWidthCount),
        y: y === wall.position.y ? y + gridSize : y
      } : {
        x: x === wall.position.x ? x + gridSize : x,
        y: randomOnGrid(gridHeightCount)
      }
    }
  }

  const checkSpace = (dontBeHeres, createItem) => {
    const item = createItem()
    const sameSpace = dontBeHeres.some(location => location.position.x === item.x && location.position.y === item.y)
    return sameSpace ? checkSpace(dontBeHeres, createItem) : item
  }

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
    const checkedPosition = checkSpace(spaceChecks, position)
    return {
      position: checkedPosition,
      ratio: ratioXY(checkedPosition, bounds),
    }
  }

  // game board setup
  useLayoutEffect(() => {
    if (reset && location.pathname.includes('board')) {
      const appliedWall = applyWall(bounds)
      const appliedWallHole = applyWallHole(appliedWall, gridWidthCount, gridHeightCount, bounds)
      const appliedHero = applyCharacter(true, appliedWall)
      const appliedOpposite = applyCharacter(false, appliedWall)
      const appliedHeroItem = applyItem(true, appliedWall, [appliedHero])
      const appliedOppositeItem = applyItem(false, appliedWall, [appliedOpposite])
      const appliedHeroGoal = applyItem(false, appliedWall, [appliedOpposite, ...(settings.hasItem ? appliedOppositeItem : [])])
      const appliedOppositeGoal = applyItem(true, appliedWall, [appliedHero, ...(settings.hasItem ? appliedHeroItem : [])])
      const wallHoleSurrounds = appliedWall.horizontal ? [{position: {x: appliedWallHole.position.x, y: appliedWallHole.position.y - gridSize}}, {position: {x: appliedWallHole.position.x, y: appliedWallHole.position.y + gridSize}}] : [{position: {x: appliedWallHole.position.x - gridSize, y: appliedWallHole.position.y}},{position: {x: appliedWallHole.position.x + gridSize, y: appliedWallHole.position.y}}]
      const appliedHeroHazard = applyItem(true, appliedWall, [appliedHero, ...(settings.hasItem ? appliedHeroItem : []), appliedOppositeGoal, ...wallHoleSurrounds])
      const appliedOppositeHazard = applyItem(false, appliedWall, [appliedOpposite, ...(settings.hasItem ? appliedOppositeItem : []), heroGoal, ...wallHoleSurrounds])
      const randomSide = (Math.floor(Math.random() * 2) + 1) % 2 === 0
      const appliedSpark = applyItem(randomSide, appliedWall, 
        [hero, ...(settings.hasItem ? [appliedHeroItem, appliedOppositeItem] : []), appliedOppositeGoal, appliedHeroGoal, ...(settings.hasHazard ? [appliedHeroHazard, appliedOppositeHazard] : []), ...wallHoleSurrounds])

      setWall(appliedWall)
      setWallHole(appliedWallHole)
      setHero({...hero, ...appliedHero})
      setOpposite({...opposite, ...appliedOpposite})
      if (settings.hasItem) {
        setHeroItem(appliedHeroItem)
        setOppositeItem(appliedOppositeItem)
      }
      setHeroGoal(appliedHeroGoal)
      setOppositeGoal(appliedOppositeGoal)
      if (settings.hasHazard) {
        setHeroHazard({...heroHazard, ...appliedHeroHazard})
        setOppositeHazard({...oppositeHazard, ...appliedOppositeHazard})
      }

      if (settings.hasSpark) {
        setSpark({...spark, ...appliedSpark})
      }

      setReset(false)
      setWin(false)
      setLose(false)
      setGameReady(true)
    }
  },[reset, location.pathname])

  // update bounds and item positions on resize
  useEffect(() => {
    if (gameReady) {
      const resize = () => {
        const minDim = gridSize * 7
        const testWidth = Math.floor(window.innerWidth / gridSize) * gridSize
        const width = testWidth < minDim ? minDim : testWidth
        const testHeight = (Math.floor(window.innerHeight / gridSize) * gridSize) - gridSize
        const height = testHeight < minDim ? minDim : testHeight
        const bounds = { width, height }
        setBounds(bounds)
        const wallX = findRatioLocation(width, wall.ratio)
        const wallY = findRatioLocation(height,wall.ratio)
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
          dimensions: createWallDimensions(prevWall.horizontal, bounds)
        }))
        setWallHole(prevHole => ({
          ...prevHole,
          position: {
            x: wall.horizontal ? findRatioLocation(width, prevHole.ratio) : keepWallFromEdge(false, wallX),
            y: !wall.horizontal ? findRatioLocation(height, prevHole.ratio) : keepWallFromEdge(true, wallY),
          }
        }))
        setHero(prev => setLocationOnRatio(prev, width, height, wall, true))
        setHeroGoal(prev => setLocationOnRatio(prev, width, height, wall, false))
        if (settings.hasItem) {
          setHeroItem(prev => setLocationOnRatio(prev, width, height, wall, true))
          setOppositeItem(prev => setLocationOnRatio(prev, width, height, wall, false))
        }
        setOpposite(prev => setLocationOnRatio(prev, width, height, wall, false))
        setOppositeGoal(prev => setLocationOnRatio(prev, width, height, wall, true))
        if (settings.hasHazard) {
          setHeroHazard(prev => setLocationOnRatio(prev, width, height, wall, true))
          setOppositeHazard(prev => setLocationOnRatio(prev, width, height, wall, false))
        }
        if (settings.hasSpark) {
          setSpark(prev => setLocationOnRatio(prev, width, height, wall, true))
        }
      }
  
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }
  }, [wall.position, gameReady])

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
  }, [wall.position, wallHole.position])

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
      canMove && !(win || lose) && move(e)
      setCanMove(false)
      !(win || lose) && setTimeout(() => setCanMove(true), 200)
    }

    document.addEventListener('keypress', handleMove)
    return () => document.removeEventListener('keypress', handleMove)
  },[canMove, win, lose])

  // hero and opposite get their items
  useEffect(() => {
    if (sameSpaceCheck(hero, heroItem)) setHero(prev => ({...prev, hasItem: true}))
    if (sameSpaceCheck(opposite, oppositeItem)) setOpposite(prev => ({...prev, hasItem: true}))
  },[hero.position, opposite.position])
  
  // handle win and lose conditions
  useEffect(() => {
    const handleWin = () => {
      if (settings.hasItem) {
        if (hero.hasItem) {
          setCanMove(false)
          setTimeout(() => {
            setWin(true)
          }, 200)
        }
      } else {
        setCanMove(false)
        setTimeout(() => {
          setWin(true)
        }, 200)
      }
    }

    const handleLose = () => {
      setCanMove(false)
      setTimeout(() => {
        setLose(true)
      }, 200);
    }

    if (sameSpaceCheck(hero,heroGoal) && sameSpaceCheck(opposite, oppositeGoal)) {
      handleWin()
    }
    if (settings.hasHazard && (sameSpaceCheck(hero, heroHazard) || sameSpaceCheck(hero, oppositeHazard) || sameSpaceCheck(opposite, heroHazard) || sameSpaceCheck(opposite, oppositeHazard))) {
      handleLose()
    }
    if (settings.hasSpark && spark.status === 'active' && (sameSpaceCheck(hero, spark) || sameSpaceCheck(opposite, spark))) {
      handleLose()
    }
  },[hero.position, opposite.position, spark])

  return (
    <PositionContext.Provider
      value={{
        win,
        lose,
        reset,
        setReset,
        settings,
        setSettings,

        wall,
        wallHole,

        hero,
        setHero,
        heroItem,
        heroGoal,
        heroHazard,
        setHeroHazard,
        spark,
        setSpark,

        opposite,
        setOpposite,
        oppositeItem,
        oppositeGoal,
        oppositeHazard,
        setOppositeHazard,

        applyItem,
        canMove,
        bounds,
        gameReady,
      }}
    >
      {children}
    </PositionContext.Provider>
  )
}