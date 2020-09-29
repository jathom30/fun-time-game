import React from 'react'
import { gridSize } from '../PositionContext'

const standardStyles = {
  height: gridSize, width: gridSize, fontSize: gridSize, lineHeight: gridSize,
}

export const Piece = ({position, className, emoji}) => (
  <div className={`Piece ${className}`} style={{...standardStyles, top: position.y, left: position.x}}>{emoji}</div>
)

export const Wall = ({ position, dimensions }) => (
  <div className="Wall" style={{ ...standardStyles, top: position.y, left: position.x, height: dimensions.height, width: dimensions.width }} />
)

export const WallHole = ({ position }) =>  (
  <div className="WallHole" style={{...standardStyles, top: position.y, left: position.x}} />
)