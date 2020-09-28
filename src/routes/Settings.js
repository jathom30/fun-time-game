import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { PositionContext } from '../PositionContext'
import './settings.scss'

const emojiChoices = [
  '👨‍⚕️','👩‍⚕️','🕵️‍♂️','🕵️‍♀️','👨‍🍳','👩‍🍳','👨‍🏫','👩‍🏫','👨‍🎓','👩‍🎓','👨‍🚀','👩‍🚀','👨‍🏭','👩‍🏭','🧟‍♂️','🧟‍♀️','👮','👮‍♀️',
]

export const Settings = () => {
  const { settings, setSettings, hero, setHero, opposite, setOpposite, heroHazard, setHeroHazard, oppositeHazard, setOppositeHazard } = useContext(PositionContext)

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
      </div>
      <div className="container-Settings">
        <p className="label-container">Settings</p>
        <div className="wrapper-container">
          <div className="rule-wrapper">
            <p>Items on board</p>
            <div className="rules-rule">
              <label htmlFor="hazards">
                Bad guys?
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
                <label className={`${hero.emoji === choice ? 'is-selected' : ''}`} key={choice} htmlFor={choice} onClick={e => setHero({...hero, emoji: e.target.htmlFor})}>
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
                <label className={`${opposite.emoji === choice ? 'is-selected' : ''}`} key={choice} htmlFor={choice} onClick={e => setOpposite({...opposite, emoji: e.target.htmlFor})}>
                  <input type="radio" name={choice} value={choice} checked={opposite.emoji === choice} onChange={e => setOpposite({...opposite,emoji: e.target.value,})} />
                  {choice}
                </label>
              ))}
            </form>
          </div>
          <div className="rule-wrapper">
            <p>Bad Guy Icons</p>
            <form className="emojiForm-rule">
              {emojiChoices.map(choice => (
                <label className={`${heroHazard.emoji === choice ? 'is-selected' : ''}`} key={choice} htmlFor={choice} onClick={e => {setHeroHazard({...heroHazard, emoji: e.target.htmlFor}); setOppositeHazard({...oppositeHazard, emoji: e.target.htmlFor})}}>
                  <input type="radio" name={choice} value={choice} checked={heroHazard.emoji === choice} onChange={e => {setHeroHazard({...heroHazard, emoji: e.target.value}); setOppositeHazard({...oppositeHazard, emoji: e.target.value})}} />
                  {choice}
                </label>
              ))}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}