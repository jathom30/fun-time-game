import React from 'react'
import { Link } from 'react-router-dom'
import './how_to.scss'

export const HowTo = () => {
  return (
    <div className="HowTo">
      <div className="topBar-HowTo">
        <Link className="backBtn-topBar" to="/">Back to home</Link>
        <Link className="backBtn-topBar" to="/board">Play</Link>
      </div>
      <div className="wrapper-HowTo">
        <div className="tldr-wrapper">
          <h1>tl;dr</h1>
          <p>Pick up your keys and get in your home without running into the cops.</p>
        </div>
        <div className="instructions-wrapper">
          <div className="group-instructions">
            <p className="main-group">Simultaneously control two characters at once</p>
            <p>The character North or West of the wall (depending on the wall's orientation) will move with "WASD". However, be careful! The other character will move at the same time, but in the opposite direction. Try to plan your moves ahead to avoid the cops!</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">Each character's avatar, key, and house are color-coded</p>
            <p>Navagate each character to pick up their keys. Then, guide each character to their house all while avoiding the cops.</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">How to Win:</p>
            <p>Land each character (with their keys) on their house at the same time.</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">How to Lose:</p>
            <p>Run into the cops.</p>
          </div>
        </div>
      </div>
    </div>
  )
}