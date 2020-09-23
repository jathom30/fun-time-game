import React, { useEffect, useLayoutEffect, useState } from 'react';
import './App.css';

const gridSize = 30

const Bomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ top: position.y, left: position.x}}>B</div>
  )
}

const GoldCoin = ({ position }) => {
  return (
    <div className="GoldCoin" style={{ top: position.y, left: position.x}}>C</div>
  )
}

const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

const Hero = ({ position }) => {
  return (
    <div style={{transform: `translate(${position.x}px, ${position.y}px)`}} className="Hero">H</div>
  )
}

const Board = ({ canMove, setCanMove }) => {
  const [position, setPosition] = useState({
    x: 0, y: 0,
  })
  const [wallDimensions, setWallDimensions] = useState({height: 90, width: gridSize})
  const [wallPosition, setWallPosition] = useState({
    x: 90, y: gridSize
  })
  const [coinPosition, setCoinPosition] = useState({x: 300, y: 300})
  const [bombPosition, setBombPosition] = useState({x: 30, y: 30})
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])
  const [bounds, setBounds] = useState({
    width: 420,
    height: 420,
  })

  // Wall position and dimensions
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
    const randomOnGrid = (count) => Math.floor(Math.random() * count) * gridSize
    const x = randomOnGrid(gridCount)
    const y = randomOnGrid(gridCount)
    // check that wall position !== max width or height
    const wallX = horizontal ? 0 : (x === 0 ? 30 : x)
    const wallY = !horizontal ? 0 : (y === 0 ? 30 : y)
    setWallPosition({
      x: wallX,
      y: wallY,
    })

    // if horizontal, player placed north of wall
    if (horizontal) {
      setPosition({
        x: randomOnGrid(gridCount),
        y: randomOnGrid(wallY / gridSize)
      })
    } else {
      setPosition({
        x: randomOnGrid(wallX / gridSize),
        y: randomOnGrid(gridCount)
      })
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
          setPosition({
            ...position,
            y: position.y >= gridSize && !checkMove(e.key) ? position.y - gridSize : position.y
          })
          break
        case 's':
          setPosition({
            ...position,
            y: position.y <= bounds.height - 60 && !checkMove(e.key) ? position.y + gridSize : position.y
          })
          break
        case 'a':
          setPosition({
            ...position,
            x: position.x >= gridSize && !checkMove(e.key) ? position.x - gridSize : position.x
          })
          break
        case 'd':
          setPosition({
            ...position,
            x: position.x <= bounds.width - 60 && !checkMove(e.key) ? position.x + gridSize : position.x
          })
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
