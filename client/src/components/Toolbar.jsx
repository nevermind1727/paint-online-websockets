import React, {useEffect} from 'react'
import "../styles/toolbar.scss"
import toolState from "../store/toolState"
import Brush from "../Tools/Brush"
import canvasState from "../store/canvasState"
import Rect from '../Tools/Rect'
import Circle from '../Tools/Circle'
import Eraser from '../Tools/Eraser'
import Line from '../Tools/Line'

const Toolbar = () => {


  const setFillColor = (e) => {
    toolState.setFillColor(e.target.value)
  }

  const download = () => {
    const data = canvasState.canvas.toDataURL()
    const a = document.createElement("a")
    a.href = data
    a.download = canvasState.sessionId + ".jpg"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="toolbar">
        <button className="toolbar__btn brush" onClick={() => toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId))}/>
        <button className="toolbar__btn rect" onClick={() => toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
        <button className="toolbar__btn circle" onClick={() => toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
        <button className="toolbar__btn eraser" onClick={() => toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
        <button className="toolbar__btn line" onClick={() => toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId))} />
        <input type="color" onChange={e => setFillColor(e)} />
        <button className="toolbar__btn undo" onClick={() => canvasState.undo()} />
        <button className="toolbar__btn redo" onClick={() => canvasState.redo()} />
        <button className="toolbar__btn save" onClick={() => download()} />
    </div>
  )
}

export default Toolbar