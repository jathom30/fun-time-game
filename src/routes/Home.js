import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import './home.scss'

export const Home = () => {
  const history = useHistory()
  return (
    <div className="Home">
      <div className="heroImg-Home">future image</div>
      <h1 className="gameTitle-Home">Game Name</h1>
      <div className="routes-Home">
        <Link className="btn-routes" to="/board">Play</Link>
        <Link className="btn-routes" to="/how-to">How to</Link>
      </div>
    </div>
  )
}