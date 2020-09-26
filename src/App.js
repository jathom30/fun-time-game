import React, { useContext, useState } from 'react';
import { HeroItem, OppositeItem, Wall, Hero, Opposite, WallHole, Goal, OppositeGoal } from './Pieces'
import { Winner } from './Winner'
import './App.css';
import { PositionContext, PositionContextProvider } from './PositionContext';

const Board = () => {
  const { win, wall, bounds, wallHole, hero, heroItem, opposite, oppositeItem, heroGoal, oppositeGoal } = useContext(PositionContext)
  

  return (
    win ? <Winner /> : (
      <div className="Board" style={{height: bounds.height, width: bounds.width}}>
        <Wall position={wall.position} dimensions={wall.dimensions} />
        <WallHole position={wallHole.position} />
        <Hero position={hero.position} hasItem={hero.hasItem} />
        {!hero.hasItem && <HeroItem position={heroItem.position} />}
        <Opposite position={opposite.position} hasItem={opposite.hasItem} />
        {!opposite.hasItem && <OppositeItem position={oppositeItem.position} />}
        <Goal position={heroGoal.position} />
        <OppositeGoal position={oppositeGoal.position} />
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
