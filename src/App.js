import React, { useContext, useState } from 'react';
import { HeroItem, OppositeItem, Wall, Hero, Opposite, WallHole, Goal, OppositeGoal, HeroHazard, OppositeHazard } from './Pieces'
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
        <Hero position={hero.position} hasItem={hero.hasItem} />
        {!hero.hasItem && <HeroItem position={heroItem.position} />}
        <Opposite position={opposite.position} hasItem={opposite.hasItem} />
        {!opposite.hasItem && <OppositeItem position={oppositeItem.position} />}
        <Goal position={heroGoal.position} />
        <OppositeGoal position={oppositeGoal.position} />
        <HeroHazard position={heroHazard.position} />
        <OppositeHazard position={oppositeHazard.position} />
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
