import React from 'react'
import { Link } from 'react-router-dom'
import './home.scss'

export const Home = () => {
  return (
    <div className="Home">
      <div className="heroImg-Home">future image</div>
      <h1 className="gameTitle-Home">Get Home Safe!</h1>
      <div className="routes-Home">
        <Link className="btn-routes" to="/board">Play</Link>
        <Link className="btn-routes" to="/how-to">How to</Link>
        <Link className="btn-routes" to="/settings">Settings</Link>
      </div>
    </div>
  )
}