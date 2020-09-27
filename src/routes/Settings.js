import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PositionContext } from '../PositionContext'
import './settings.scss'

export const Settings = () => {
  const { settings, setSettings } = useContext(PositionContext)

  const handleSettings = (e, setting) => {
    setSettings({
      ...settings,
      [setting]: e.target.checked,
    })
  }
  return (
    <div className="Settings">
      <div className="topBar-Settings">
        <Link className="backBtn-topBar" to="/">Back to home</Link>
        <Link className="backBtn-topBar" to="/board">Play</Link>
        <Link className="backBtn-topBar" to="/how-to">How to</Link>
      </div>
      <div className="wrapper-Settings">
        <div className="rule-wrapper">
          <label htmlFor="hazards">
            Hazards?
            <input checked={settings.hasHazard} onChange={e => handleSettings(e,'hasHazard')} type="checkbox" />
          </label>
        </div>
        <div className="rule-wrapper">
          <label htmlFor="items">
            Keys?
            <input checked={settings.hasItem} onChange={e => handleSettings(e,'hasItem')} type="checkbox" />
          </label>
        </div>
      </div>
    </div>
  )
}