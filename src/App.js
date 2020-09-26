import React, { useContext, useState } from 'react';
import { Wall, WallHole, Item } from './Pieces'
import { Winner } from './Winner'
import { Loser } from './Loser'
import './App.css';
import { PositionContext, PositionContextProvider } from './PositionContext';

const Board = () => {
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
    win ? <Winner /> : lose ? <Loser /> : (
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

const App = () => {
  return (
    <div className="App">
      <PositionContextProvider>
        <Board />
      </PositionContextProvider>
    </div>
  );
}

export default App;
