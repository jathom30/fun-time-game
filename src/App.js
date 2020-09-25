import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Bomb, OtherBomb, Wall, Hero, Opposite, WallHole } from './Pieces'
import { Winner } from './Winner'
import { Loser } from './Loser'
import './App.css';

const gridSize = 60

const Board = ({ setLose, setWin}) => {
  const [canMove, setCanMove] = useState(true)
  const [position, setPosition] = useState({})
  const [hasBomb, setHasBomb] = useState(false)
  const [hasOtherBomb, setHasOtherBomb] = useState(false)
  const [wallDimensions, setWallDimensions] = useState({height: 0, width: gridSize})
  const [wallPosition, setWallPosition] = useState({})
  const [wallHole, setWallHole] = useState({})
  const [otherBombPosition, setOtherBombPosition] = useState({x: 0, y: 0})
  const [bombPosition, setBombPosition] = useState({x: 0, y: 0})
  const [bombUsed, setBombUsed] = useState(false)
  const [oppositePosition, setOppositePosition] = useState({})
  const [oppositeHasBomb, setOppositeHasBomb] = useState(false)
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])
  const [bounds, setBounds] = useState({
    width: Math.floor(document.documentElement.clientWidth / gridSize) * gridSize,
    height: Math.floor(document.documentElement.clientHeight / gridSize) * gridSize,
  })

  // Wall position and dimensions AND hero, otherBomb, bomb, opposite placements
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

    // place Hero, otherBomb, Bomb, and Opposite based on wall position
    if (horizontal) {
      // hero
      const hero = {
        x: randomOnGrid(gridCount),
        y: randomOnGrid(wallY / gridSize)
      }
      setPosition(hero)
      // otherBomb
      const otherBombX = randomOnGrid(gridCount)
      const otherBombY = randomOnGrid(gridCount, (wallY / gridSize))
      const otherBomb = {
        x: otherBombX,
        y: otherBombY === wallY ? otherBombY + gridSize : otherBombY
      }
      setOtherBombPosition(otherBomb)
      // bomb
      const bombX = randomOnGrid(gridCount)
      const bombY = randomOnGrid(wallY / gridSize)
      const bomb = bombX === hero.x && bombY === hero.y ? {
        x: bombX + gridSize, y: bombY + gridSize,
      } : {x: bombX, y: bombY}
      setBombPosition(bomb)
      // opposite
      const oppositeX = randomOnGrid(gridCount)
      const oppositeY = randomOnGrid(gridCount, (wallY / gridSize))
      const opposite = oppositeX === otherBombX && oppositeY === otherBombY ? {
        x: oppositeX + gridSize, y: oppositeY + gridSize,
      } : {x: oppositeX, y: oppositeY}
      setOppositePosition(opposite)
    } else {
      const hero = {
        x: randomOnGrid(wallX / gridSize),
        y: randomOnGrid(gridCount)
      }
      setPosition(hero)
      const otherBombX = randomOnGrid(gridCount, (wallX / gridSize))
      const otherBombY = randomOnGrid(gridCount)
      const otherBomb = {
        x: otherBombX === wallX ? otherBombX + gridSize : otherBombX,
        y: otherBombY
      }
      setOtherBombPosition(otherBomb)
      // bomb
      const bombX = randomOnGrid(wallX / gridSize)
      const bombY = randomOnGrid(gridCount)
      const bomb = bombX === hero.x && bombY === hero.y ? {
        x: bombX + gridSize, y: bombY + gridSize,
      } : {x: bombX, y: bombY}
      setBombPosition(bomb)
      // opposite
      const oppositeX = randomOnGrid(gridCount, (wallX / gridSize))
      const oppositeY = randomOnGrid(gridCount)
      const opposite = oppositeX === otherBombX && oppositeY === otherBombY ? {
        x: oppositeX + gridSize, y: oppositeY + gridSize,
      } : {x: oppositeX, y: oppositeY}
      setOppositePosition(opposite)
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
      const checkOppositeMove = (key) => {
        switch (key) {
          case 'w':
            return voidPositions.some(xy => xy.y === oppositePosition.y + gridSize && xy.x === oppositePosition.x)
          case 's':
            return voidPositions.some(xy => xy.y === (oppositePosition.y - gridSize) && xy.x === oppositePosition.x)
          case 'a':
            return voidPositions.some(xy => xy.x === oppositePosition.x + gridSize && xy.y === oppositePosition.y)
          case 'd':
            return voidPositions.some(xy => xy.x === oppositePosition.x - gridSize && xy.y === oppositePosition.y)
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
          setOppositePosition(prevPos => ({
            ...prevPos,
            y: (prevPos.y + (gridSize * 2)) <= bounds.height && !checkOppositeMove(e.key) ? prevPos.y + gridSize : prevPos.y
          }))
          break
        case 's':
          setPosition(prevPos => ({
            ...prevPos,
            y: prevPos.y <= bounds.height - (gridSize * 2) && !checkMove(e.key) ? prevPos.y + gridSize : prevPos.y
          }))
          setOppositePosition(prevPos => ({
            ...prevPos,
            y: prevPos.y >= gridSize && !checkOppositeMove(e.key) ? prevPos.y - gridSize : prevPos.y
          }))
          break
        case 'a':
          setPosition(prevPos => ({
            ...prevPos,
            x: prevPos.x >= gridSize && !checkMove(e.key) ? prevPos.x - gridSize : prevPos.x
          }))
          setOppositePosition(prevPos => ({
            ...prevPos,
            x: prevPos.x <= bounds.width - (gridSize * 2) && !checkOppositeMove(e.key) ? prevPos.x + gridSize : prevPos.x
          }))
          break
        case 'd':
          setPosition(prevPos => ({
            ...prevPos,
            x: prevPos.x <= bounds.width - (gridSize * 2) && !checkMove(e.key) ? prevPos.x + gridSize : prevPos.x
          }))
          setOppositePosition(prevPos => ({
            ...prevPos,
            x: prevPos.x >= gridSize && !checkOppositeMove(e.key) ? prevPos.x - gridSize : prevPos.x
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

  // bomb and otherBomb functionality
  useEffect(() => {
    // bomb
    if (position.x === bombPosition.x && position.y === bombPosition.y) setHasBomb(true)
    if (hasBomb) {
      const horizontal = wallDimensions.width > wallDimensions.height
      const atWall = voidPositions.some(coord => {
        if (horizontal) {
          return position.x === coord.x && (position.y + gridSize) === coord.y
        } else {
          return (position.x + gridSize) === coord.x && position.y === coord.y
        }
      })
      if (atWall && !bombUsed) {
        const blownWallCoords = horizontal ? {
          x: position.x, y: position.y + gridSize
        } : {
          x: position.x + gridSize, y: position.y
        }
        setWallHole(blownWallCoords)
        setBombUsed(true)
      }
    }

    // otherBomb
    if (position.x === otherBombPosition.x && position.y === otherBombPosition.y) setHasOtherBomb(true)
  },[position])

  // clear wall coords when bomb used
  useEffect(() => {
    if (bombUsed) setVoidPositions(prevVoid => prevVoid.filter(coord => !(coord.x === wallHole.x && coord.y === wallHole.y)))
  },[bombUsed])

  // opposite gets bomb
  useEffect(() => {
    if (oppositePosition.x === otherBombPosition.x && oppositePosition.y === otherBombPosition.y) setOppositeHasBomb(true)
  },[oppositePosition])

  // touch opposite
  useEffect(() => {
    if (hasOtherBomb) {
      if (position.x === oppositePosition.x && position.y === oppositePosition.y) {
        setWin(true)
      }
    }
    if (oppositeHasBomb) {
      if (position.x === oppositePosition.x && position.y === oppositePosition.y) {
        setLose(true)
      }
    }
  },[position, oppositePosition])

  return (
    <div className="Board" style={{height: bounds.height, width: bounds.width}}>
      <Opposite position={oppositePosition} hasBomb={oppositeHasBomb} />
      <Hero position={position} hasBomb={hasBomb && !bombUsed} hasOtherBomb={hasOtherBomb}  />
      <Wall position={wallPosition} dimensions={wallDimensions} />
      {!(hasOtherBomb || oppositeHasBomb) && <OtherBomb position={otherBombPosition} />}
      {!hasBomb && !bombUsed && <Bomb position={bombPosition} />}
      {wallHole.x && <WallHole position={wallHole} />}
    </div>
  )
}

const App = () => {
  const [win, setWin] = useState(false)
  const [lose, setLose] = useState(false)

  return (
    <div className="App">
      {win && <Winner />}
      {lose && <Loser />}
      {!win && !lose && (
        <Board setLose={setLose} setWin={setWin} />
      )}
    </div>
  );
}

export default App;
