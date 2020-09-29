import React, { useContext, useEffect } from 'react'
import { PositionContext } from '../PositionContext'
import { Piece } from './Pieces'
import { gridSize } from '../PositionContext'

export const Spark = () => {
  const { applyItem, spark, setSpark, wall, hero, opposite, heroItem, heroGoal, oppositeItem, oppositeGoal, wallHole, gameReady} = useContext(PositionContext)


  useEffect(() => {
    const randomSide = () =>  (Math.floor(Math.random() * 2) + 1) % 2 === 0
    const updateStatus = (status) => 
    status === 'dormant' ? 'inactive' : status === 'inactive' ? 'active' : 'dormant'
    const wallHoleSurrounds = wall.horizontal ? [{position: {x: wallHole.position.x, y: wallHole.position.y - gridSize}}, {position: {x: wallHole.position.x, y: wallHole.position.y + gridSize}}] : [{position: {x: wallHole.position.x - gridSize, y: wallHole.position.y}},{position: {x: wallHole.position.x + gridSize, y: wallHole.position.y}}]
    if (gameReady) {setInterval(() => {
      setSpark(prev => ({
        ...prev,
        ...(prev.status === 'active' && applyItem(randomSide(), wall, [wall, hero, heroItem, heroGoal, opposite, oppositeItem, oppositeGoal, ...wallHoleSurrounds])),
        status: updateStatus(prev.status)
      }))
    },3000)}
  },[gameReady])

  return (
    <Piece className={`HeroSpark is-${spark.status}`} position={spark.position} emoji={spark.emoji} />
  )
}