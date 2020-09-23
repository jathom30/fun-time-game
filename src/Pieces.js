import React from 'react'

export const Bomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ top: position.y, left: position.x}}>B</div>
  )
}

export const OtherBomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ top: position.y, left: position.x}}>B</div>
  )
}

export const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

export const Hero = ({ position, hasBomb, hasOtherBomb }) => {
  return (
    <div style={{top: position.y, left: position.x}} className={`Hero ${(hasBomb || hasOtherBomb) ? 'has-bomb' : ''}`}>H</div>
  )
}

export const Enemy = ({ position, hasBomb }) => {
  return (
    <div style={{top: position.y, left: position.x}} className={`Enemy ${hasBomb ? 'has-bomb' : ''}`}>E</div>
  )
}

export const WallHole = ({ position }) => {
  return (
    <div className="WallHole" style={{top: position.y, left: position.x}} />
  )
}