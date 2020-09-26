import React, { useContext } from 'react'
import { PositionContext } from '../PositionContext'

export const WinLose = ({header, byline}) => {
  const { setReset } = useContext(PositionContext)
  return (
    <div className="WinLose">
      <h1>{header}</h1>
      <p>{byline}</p>
      <button className="repeatBtn" onClick={() => setReset(true)}>Play again</button>
    </div>
  )
}