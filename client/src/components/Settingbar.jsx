import React from 'react'
import "../styles/settingbar.scss"
import toolState from "../store/toolState"

const Settingbar = () => {
  return (
    <div className="settingbar">
        <label className="settingbar__item_first" htmlFor='line-width'>Line Width</label>
        <input onChange={(e) => toolState.setLineWidth(e.target.value)} className="settingbar__item_second" type="number" defaultValue={1} min={1} max={50} id="line-width"/>
        <label className="settingbar__item_first" htmlFor='stroke-color'>Stroke Color</label>
        <input onChange={(e) => toolState.setStrokeColor(e.target.value)} className="settingbar__item_second" type="color" id="stroke-color"/>
    </div>
  )
}

export default Settingbar