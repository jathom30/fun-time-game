import React from 'react'
import { Link } from 'react-router-dom'
import './how_to.scss'

export const HowTo = () => {
  return (
    <div className="HowTo">
      <div className="topBar-HowTo">
        <Link className="backBtn-topBar" to="/">Back to home</Link>
      </div>
      <div className="wrapper-HowTo">
        <div className="tldr-wrapper">
          <h1>tl;dr</h1>
          <p>Pick up your keys and get in your home without running into any bad guys.</p>
        </div>
          <p className="label-wrapper">Instructions</p>
        <div className="instructions-wrapper">
          <div className="group-instructions">
            <p className="main-group">Simultaneously control two characters at once</p>
            <p>The character North or West of the wall (depending on the wall's orientation) will move with "WASD". However, be careful! The other character will move at the same time, but in the opposite direction. Try to plan your moves ahead to avoid the bad guys (red circle)!</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">Each character's avatar, key, and house are color-coded</p>
            <p>Navagate each character to pick up their keys. Then, guide each character to their house all while avoiding any bad guys.</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">How to Win:</p>
            <p>Land each character (with their keys) on their house at the same time.</p>
          </div>
          <div className="group-instructions">
            <p className="main-group">How to Lose:</p>
            <p>Run into the bad guys.</p>
          </div>
        </div>
          <p className="label-wrapper">Notes</p>
        <div className="notes-wrapper">
          <div className="group-notes">
            <p className="main-group">Experiment with screen/font sizes</p>
            <p>The game's board will update your characters position based on the size of the screen and your font settings. If it looks like it might help, expand your screen to give you more wiggle room or shrink your screen to bring your objective to you.</p>
          </div>
          <div className="group-notes">
            <p className="main-group">Not all games are winnable</p>
            <p>Due to the random generation of each board, not all games are winnable.</p>
          </div>
        </div>
      </div>
    </div>
  )
}