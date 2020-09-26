import React from 'react'
const gridSize = 60

const standardStyles = {
  height: gridSize, width: gridSize, fontSize: gridSize, lineHeight: gridSize,
}

export const Item = ({position, className, emoji}) => (
  <div className={className} style={{...standardStyles, top: position.y, left: position.x}}>{emoji}</div>
)

export const Wall = ({ position, dimensions }) => {
  return (
    <div className="Wall" style={{ ...standardStyles, top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
  )
}

export const WallHole = ({ position }) => {
  return (
    <div className="WallHole" style={{...standardStyles, top: position.y, left: position.x}} />
  )
}