import React, { useContext } from 'react'
import './board.scss'
import { Wall, WallHole, Piece, WinLose, Spark } from '../_components'
import { PositionContext } from '../PositionContext';
import { Link } from 'react-router-dom'

export const Board = () => {
  const {
    win, 
    lose,
    settings,
    wall, 
    secondaryWall,
    bounds, 
    wallHole, 
    hero, 
    heroItem, 
    opposite, 
    oppositeItem, 
    heroGoal, 
    oppositeGoal, 
    heroHazard, 
    oppositeHazard,
  } = useContext(PositionContext)
  

  return (
    <div className="Board" style={{height: bounds.height, width: bounds.width}}>
      <Wall position={wall.position} dimensions={wall.dimensions} />
      <WallHole position={wallHole.position} />
      {/* <Wall position={secondaryWall.position} dimensions={secondaryWall.dimensions} /> */}
      <Piece position={hero.position} className={`Hero ${hero.hasItem ? 'has-item' : ''}`} emoji={hero.emoji} />
      {settings.hasItem && !hero.hasItem && <Piece position={heroItem.position} className="HeroItem" emoji="🔑" />}
      <Piece position={opposite.position} className={`Opposite ${opposite.hasItem ? 'has-item' : ''}`} emoji={opposite.emoji} />
      {settings.hasItem && !opposite.hasItem && <Piece position={oppositeItem.position} className="HeroItem opposite--HeroItem" emoji="🔑" />}
      <Piece position={heroGoal.position} className="HeroGoal" emoji="🏠" />
      <Piece position={oppositeGoal.position} className="HeroGoal opposite--HeroGoal" emoji="🏠" />
      {settings.hasHazard && (
        <>
          <Piece position={heroHazard.position} className="HeroHazard" emoji={heroHazard.emoji} />
          <Piece position={oppositeHazard.position} className="HeroHazard" emoji={oppositeHazard.emoji} />
        </>
      )}
      {settings.hasSpark && (
        <>
          <Spark />
        </>
      )}

      {win && <WinLose header="Amazing!" byline="You've Won!" />}
      {lose && <WinLose header="Well, dern." byline="You've lost..." />}
    </div>
  )
}

export const BoardRoute = () => {
  const {setReset} = useContext(PositionContext)

  return (
    <div className="BoardRoute">
      <div className="topBar-BoardRoute">
        <Link className="backBtn-topBar" to="/">Back to home</Link>
        <button onClick={() => setReset(true)}>Reset game</button>
      </div>
      <Board />
    </div>
  )
}