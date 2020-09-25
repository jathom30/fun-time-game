import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Bomb, OtherBomb, Wall, Hero, Opposite, WallHole } from './Pieces'
import { Winner } from './Winner'
import { Loser } from './Loser'
import './App.css';

const gridSize = 60
document.documentElement.style.setProperty('--height', gridSize/2+'px')

const bounds = {
  width: Math.floor(document.documentElement.clientWidth / gridSize) * gridSize,
  height: Math.floor(document.documentElement.clientHeight / gridSize) * gridSize,
}

const Board = ({ setLose, setWin}) => {
  const [canMove, setCanMove] = useState(true)
  const [position, setPosition] = useState({})
  const [hasBomb, setHasBomb] = useState(false)
  const [wallDimensions, setWallDimensions] = useState({height: 0, width: gridSize})
  const [wallPosition, setWallPosition] = useState({})
  const [wallHole, setWallHole] = useState({})
  const [oppositeBombPosition, setOppositeBombPosition] = useState({x: 0, y: 0})
  const [bombPosition, setBombPosition] = useState({x: 0, y: 0})
  const [bombUsed, setBombUsed] = useState(false)
  const [oppositePosition, setOppositePosition] = useState({})
  const [oppositeHasBomb, setOppositeHasBomb] = useState(false)
  const [voidPositions, setVoidPositions] = useState([{x: -gridSize, y: -gridSize}])

  // Wall position and dimensions AND hero, oppositeBomb, bomb, opposite, wall hole placements
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

    console.log(horizontal, wallX, wallY)

    // place Hero, oppositeBomb, Bomb, wall hole, and Opposite based on wall position
    if (horizontal) {
      // hero
      const hero = {
        x: randomOnGrid(gridCount),
        y: randomOnGrid(wallY / gridSize)
      }
      setPosition(hero)
      // oppositeBomb
      const oppositeBombX = randomOnGrid(gridCount)
      const oppositeBombY = randomOnGrid(gridCount, (wallY / gridSize))
      const oppositeBomb = {
        x: oppositeBombX,
        y: oppositeBombY === wallY ? oppositeBombY + gridSize : oppositeBombY
      }
      setOppositeBombPosition(oppositeBomb)
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
      const opposite = oppositeX === oppositeBombX && oppositeY === oppositeBombY ? {
        x: oppositeX + gridSize, y: oppositeY + gridSize,
      } : {x: oppositeX, y: oppositeY}
      setOppositePosition(opposite)
      //wall hole
      const wallHoleX = randomOnGrid(gridCount)
      setWallHole({x:wallHoleX,y: wallY})
    } else {
      const hero = {
        x: randomOnGrid(wallX / gridSize),
        y: randomOnGrid(gridCount)
      }
      setPosition(hero)
      const oppositeBombX = randomOnGrid(gridCount, (wallX / gridSize))
      const oppositeBombY = randomOnGrid(gridCount)
      const oppositeBomb = {
        x: oppositeBombX === wallX ? oppositeBombX + gridSize : oppositeBombX,
        y: oppositeBombY
      }
      setOppositeBombPosition(oppositeBomb)
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
      const opposite = oppositeX === oppositeBombX && oppositeY === oppositeBombY ? {
        x: oppositeX + gridSize, y: oppositeY + gridSize,
      } : {x: oppositeX, y: oppositeY}
      setOppositePosition(opposite)
      //wall hole
      const wallHoleY = randomOnGrid(gridCount)
      setWallHole({x:wallX,y: wallHoleY})
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
    // filter out wallhole
    .filter(coord => !(coord.x === wallHole.x && coord.y === wallHole.y))

    setVoidPositions(voidCoords)

  },[wallPosition, wallDimensions, wallHole])

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

  // hero gets bomb
  useEffect(() => {
    // bomb
    if (position.x === bombPosition.x && position.y === bombPosition.y) setHasBomb(true)
  },[position])

  // opposite gets bomb
  useEffect(() => {
    if (oppositePosition.x === oppositeBombPosition.x && oppositePosition.y === oppositeBombPosition.y) setOppositeHasBomb(true)
  },[oppositePosition])

  return (
    <div className="Board" style={{height: bounds.height, width: bounds.width}}>
      <Opposite position={oppositePosition} hasBomb={oppositeHasBomb} />
      <Hero position={position} hasBomb={hasBomb && !bombUsed} />
      <Wall position={wallPosition} dimensions={wallDimensions} />
      {!oppositeHasBomb && <OtherBomb position={oppositeBombPosition} />}
      {!hasBomb && !bombUsed && <Bomb position={bombPosition} />}
      {wallHole.x > 0 && <WallHole position={wallHole} />}
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
