import React from 'react'
const gridSize = 50

const standardStyles = {
  height: gridSize, width: gridSize, fontSize: gridSize, lineHeight: gridSize,
}

export const Bomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ ...standardStyles, top: position.y, left: position.x}}>💣</div>
  )
}

export const OtherBomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ ...standardStyles, top: position.y, left: position.x}}>💣</div>
  )
}

export const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ ...standardStyles, top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

export const Hero = ({ position, hasBomb, hasOtherBomb }) => {
  return (
    <div style={{...standardStyles, top: position.y, left: position.x}} className={`Hero ${(hasBomb || hasOtherBomb) ? 'has-bomb' : ''}`}>🦸‍♂️</div>
  )
}

export const Enemy = ({ position, hasBomb }) => {
  return (
    <div style={{...standardStyles, top: position.y, left: position.x}} className={`Enemy ${hasBomb ? 'has-bomb' : ''}`}>👺</div>
  )
}

export const WallHole = ({ position }) => {
  return (
    <div className="WallHole" style={{...standardStyles, top: position.y, left: position.x}} />
  )
}