import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Bomb, GoldCoin, Wall, Hero, Enemy } from './Pieces'
import './App.css';

const gridSize = 30

const Board = ({ canMove, setCanMove }) => {
  const [position, setPosition] = useState({
    x: 0, y: 0,
  })
  const [wallDimensions, setWallDimensions] = useState({height: 0, width: gridSize})
  const [wallPosition, setWallPosition] = useState({
    x: 0, y: gridSize
  })
  const [coinPosition, setCoinPosition] = useState({x: 0, y: 0})
  const [bombPosition, setBombPosition] = useState({x: 0, y: 0})
  const [enemyPosition, setEnemyPosition] = useState({x: 300, y: 300})
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])
  const [bounds, setBounds] = useState({
    width: 420,
    height: 420,
  })

  // Wall position and dimensions AND hero, coin, bomb placements
  useLayoutEffect(() => {
    const horizontal = Math.floor(Math.random() * 2)
    const dimensions = () => {
      return horizontal ? {
        width: bounds.width,
        height: gridSize,
      } : {
        width: gridSize,
        height: bounds.height,
      }
    }
    setWallDimensions(dimensions())

    const gridCount = bounds.width / gridSize
    const randomOnGrid = (max, min = 0) => (Math.floor(Math.random() * (max - min)) + min) * gridSize
    const x = randomOnGrid(gridCount)
    const y = randomOnGrid(gridCount)

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

    const wallX = horizontal ? 0 : wallCheck(x, bounds.width)
    const wallY = !horizontal ? 0 : wallCheck(y, bounds.height)
    setWallPosition({
      x: wallX,
      y: wallY,
    })

    // place Hero, Coin, and Bomb based on wall position
    if (horizontal) {
      // hero
      const hero = {
        x: randomOnGrid(gridCount),
        y: randomOnGrid(wallY / gridSize)
      }
      setPosition(hero)
      // coin
      const coinY = randomOnGrid(gridCount, (wallY / gridSize))
      const coin = {
        x: randomOnGrid(gridCount),
        y: coinY === wallY ? coinY + gridSize : coinY
      }
      setCoinPosition(coin)
      // bomb
      const bombX = randomOnGrid(gridCount)
      const bombY = randomOnGrid(wallY / gridSize)
      const bomb = bombX === hero.x && bombY === hero.y ? {
        x: bombX + gridSize, y: bombY + gridSize,
      } : {x: bombX, y: bombY}
      setBombPosition(bomb)
    } else {
      const hero = {
        x: randomOnGrid(wallX / gridSize),
        y: randomOnGrid(gridCount)
      }
      setPosition(hero)
      const coinX = randomOnGrid(gridCount, (wallX / gridSize))
      const coin = {
        x: coinX === wallX ? coinX + gridSize : coinX,
        y: randomOnGrid(gridCount)
      }
      setCoinPosition(coin)
      // bomb
      const bombX = randomOnGrid(wallX / gridSize)
      const bombY = randomOnGrid(gridCount)
      const bomb = bombX === hero.x && bombY === hero.y ? {
        x: bombX + gridSize, y: bombY + gridSize,
      } : {x: bombX, y: bombY}
      setBombPosition(bomb)
    }

  },[])

  // Get clipping coords
  useEffect(() => {
    const yUnits = wallDimensions.height / gridSize
    const xUnits = wallDimensions.width / gridSize
    const yVoids = Array.from({length: yUnits}, (v, i) => i).map(u => u * gridSize + wallPosition.y)
    const xVoids = Array.from({length: xUnits}, (v, i) => i).map(u => u * gridSize + wallPosition.x)
    const voidCoords = yVoids.map(y => {
      return xVoids.map(x => {
        return {
          x, y
        }
      })
    }).flat()

    setVoidPositions(voidCoords)

  },[wallPosition, wallDimensions])

  // move player
  useEffect(() => {
    const move = (e) => {
      const checkMove = (key) => {
        switch (key) {
          case 'w':
            return voidPositions.some(xy => xy.y === position.y - gridSize && xy.x === position.x)
          case 's':
            return voidPositions.some(xy => xy.y === position.y + gridSize && xy.x === position.x)
          case 'a':
            return voidPositions.some(xy => xy.x === position.x - gridSize && xy.y === position.y)
          case 'd':
            return voidPositions.some(xy => xy.x === position.x + gridSize && xy.y === position.y)
          default:
            return true
        }
      }

      switch (e.key) {
        case 'w':
          setPosition(prevPos => ({
            ...prevPos,
            y: prevPos.y >= gridSize && !checkMove(e.key) ? prevPos.y - gridSize : prevPos.y
          }))
          break
        case 's':
          setPosition(prevPos => ({
            ...prevPos,
            y: prevPos.y <= bounds.height - (gridSize * 2) && !checkMove(e.key) ? prevPos.y + gridSize : prevPos.y
          }))
          break
        case 'a':
          setPosition(prevPos => ({
            ...prevPos,
            x: prevPos.x >= gridSize && !checkMove(e.key) ? prevPos.x - gridSize : prevPos.x
          }))
          break
        case 'd':
          setPosition(prevPos => ({
            ...prevPos,
            x: prevPos.x <= bounds.width - (gridSize * 2) && !checkMove(e.key) ? prevPos.x + gridSize : prevPos.x
          }))
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

  return (
    <div className="Board" style={{height: bounds.height, width: bounds.width}}>
      <Hero position={position} />
      <Wall position={wallPosition} dimensions={wallDimensions} />
      <GoldCoin position={coinPosition} />
      <Bomb position={bombPosition} />
      <Enemy position={enemyPosition} />
    </div>
  )
}

const App = () => {
  const [canMove, setCanMove] = useState(true)

  return (
    <div className="App">
      <Board canMove={canMove} setCanMove={setCanMove} />
    </div>
  );
}

export default App;
