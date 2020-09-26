import React, { useContext } from 'react'
import './board.scss'
import { Wall, WallHole, Item, WinLose } from '../_components'
import { PositionContext } from '../PositionContext';
import { Link } from 'react-router-dom'

export const Board = () => {
  const {
    win, 
    lose,
    wall, 
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
    win ? (
    <WinLose header="Amazing!" byline="You've Won!" />
    ) : lose ? (
    <WinLose header="Well, dern." byline="You've lost..." />
      ) : (
      <div className="Board" style={{height: bounds.height, width: bounds.width}}>
        <Wall position={wall.position} dimensions={wall.dimensions} />
        <WallHole position={wallHole.position} />
        <Item position={hero.position} className={`Hero ${hero.hasItem ? 'has-item' : ''}`} emoji="🕵️‍♂️" />
        {!hero.hasItem && <Item position={heroItem.position} className="HeroItem" emoji="🔑" />}
        <Item position={opposite.position} className={`Opposite ${opposite.hasItem ? 'has-item' : ''}`} emoji="🕵️‍♀️" />
        {!opposite.hasItem && <Item position={oppositeItem.position} className="HeroItem opposite--HeroItem" emoji="🔑" />}
        <Item position={heroGoal.position} className="HeroGoal" emoji="🏠" />
        <Item position={oppositeGoal.position} className="HeroGoal opposite--HeroGoal" emoji="🏠" />
        <Item position={heroHazard.position} className="HeroHazard" emoji="🚔" />
        <Item position={oppositeHazard.position} className="HeroHazard opposite--HeroHazard" emoji="🚔" />
      </div>
    )
  )
}

export const BoardRoute = () => {
  return (
    <div className="BoardRoute">
      <div className="topBar-BoardRoute">
        <Link className="backBtn-topBar" to="/">Back to home</Link>
        <Link className="backBtn-topBar" to="/how-to">How to</Link>
      </div>
      <Board />
    </div>
  )
}