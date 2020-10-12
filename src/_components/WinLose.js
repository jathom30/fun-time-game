import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { PositionContext } from '../PositionContext'

export const WinLose = ({header, byline}) => {
  const { setReset } = useContext(PositionContext)
  const [action, setAction] = useState(false)
  const history = useHistory()

  useEffect(() => {
    setTimeout(() => {
      setAction(true)
    },100)
  },[])

  return (
    <>
      <div className={`WinLose ${action ? 'blow-up' : ''}`}>
        <h1>{header}</h1>
        <p>{byline}</p>
        <button className="repeatBtn" onClick={() => setReset(true)}>Play again</button>
        <button className="repeatBtn" onClick={() => history.push('/')}>Return home</button>
      </div>
      <div className="overLay"></div>
    </>
  )
}