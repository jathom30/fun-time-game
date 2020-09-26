import React from 'react'
const gridSize = 60

const standardStyles = {
  height: gridSize, width: gridSize, fontSize: gridSize, lineHeight: gridSize,
}

export const HeroItem = ({ position }) => {
  return (
    <div className="HeroItem" style={{ ...standardStyles, top: position.y, left: position.x}}>💣</div>
  )
}

export const OppositeItem = ({ position }) => {
  return (
    <div className="HeroItem opposite--HeroItem" style={{ ...standardStyles, top: position.y, left: position.x}}>💣</div>
  )
}

export const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ ...standardStyles, top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

export const Hero = ({ position, hasItem }) => {
  return (
    <div style={{...standardStyles, top: position.y, left: position.x}} className={`Hero ${hasItem ? 'has-item' : ''}`}>🦸‍♂️</div>
  )
}

export const Opposite = ({ position, hasItem }) => {
  return (
    <div style={{...standardStyles, top: position.y, left: position.x}} className={`Opposite ${hasItem ? 'has-item' : ''}`}>🦸‍♀️</div>
  )
}

export const WallHole = ({ position }) => {
  return (
    <div className="WallHole" style={{...standardStyles, top: position.y, left: position.x}} />
  )
}

export const Goal = ({position}) => {
  return (
    <div className="Goal" style={{...standardStyles, top: position.y, left: position.x}}>🏦</div>
  )
}

export const OppositeGoal = ({position}) => {
  return (
    <div className="Goal opposite--Goal" style={{...standardStyles, top: position.y, left: position.x}}>🏦</div>
  )
}