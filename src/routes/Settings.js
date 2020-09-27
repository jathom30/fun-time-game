import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PositionContext } from '../PositionContext'
import './settings.scss'

const emojiChoices = [
  '👨‍⚕️','👩‍⚕️','🕵️‍♂️','🕵️‍♀️','👨‍🍳','👩‍🍳','👨‍🏫','👩‍🏫','👨‍🎓','👩‍🎓','👨‍🚀','👩‍🚀','👨‍🏭','👩‍🏭','🧟‍♂️','🧟‍♀️',
]

const otherEmojiChoices = ['🐛','🍣','🇺🇸',]

export const Settings = () => {
  const { settings, setSettings, hero, setHero, opposite, setOpposite } = useContext(PositionContext)

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
        {/* <Link className="backBtn-topBar" to="/board">Play</Link>
        <Link className="backBtn-topBar" to="/how-to">How to</Link> */}
      </div>
      <div className="wrapper-Settings">
        <div className="rule-wrapper">
          <p>Items on board</p>
          <div className="rules-rule">
            <label htmlFor="hazards">
              Hazards?
              <input checked={settings.hasHazard} onChange={e => handleSettings(e,'hasHazard')} type="checkbox" />
            </label>
            <label htmlFor="items">
              Keys?
              <input checked={settings.hasItem} onChange={e => handleSettings(e,'hasItem')} type="checkbox" />
            </label>
          </div>
        </div>
        <div className="rule-wrapper">
          <p>Hero Icon</p>
          <form className="emojiForm-rule">
            {emojiChoices.map(choice => (
              <label htmlFor={choice}>
                <input type="radio" name={choice} value={choice} checked={hero.emoji === choice} onChange={e => setHero({...hero,emoji: e.target.value,})} />
                {choice}
              </label>
            ))}
          </form>
        </div>
        <div className="rule-wrapper">
          <p>Opposite Icon</p>
          <form className="emojiForm-rule">
            {emojiChoices.map(choice => (
              <label htmlFor={choice}>
                <input type="radio" name={choice} value={choice} checked={opposite.emoji === choice} onChange={e => setOpposite({...opposite,emoji: e.target.value,})} />
                {choice}
              </label>
            ))}
          </form>
        </div>
      </div>
    </div>
  )
}