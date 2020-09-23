import React from 'react'

export const Bomb = ({ position }) => {
  return (
    <div className="Bomb" style={{ top: position.y, left: position.x}}>B</div>
  )
}

export const GoldCoin = ({ position }) => {
  return (
    <div className="GoldCoin" style={{ top: position.y, left: position.x}}>C</div>
  )
}

export const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

export const Hero = ({ position }) => {
  return (
    <div style={{top: position.y, left: position.x}} className="Hero">H</div>
  )
}

export const Enemy = ({ position }) => {
  return (
    <div style={{top: position.y, left: position.x}} className="Enemy">E</div>
  )
}

