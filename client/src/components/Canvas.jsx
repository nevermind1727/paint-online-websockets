import React, { useEffect, useRef, useState } from 'react'
import "../styles/canvas.scss"
import {observer} from "mobx-react-lite"
import canvasState from "../store/canvasState"
import Brush from '../Tools/Brush'
import toolState from "../store/toolState"
import {useParams} from "react-router-dom"
import  {Modal, Button} from "react-bootstrap";
import Circle from "../Tools/Circle"
import Rect from "../Tools/Rect"
import Eraser from "../Tools/Eraser"
import Line from "../Tools/Line"
import axios from "axios"

const Canvas = observer(() => {
  const [modal, setModal] = useState(true)
  const params = useParams()
  const usernameRef = useRef()

  const canvasRef = useRef()

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current)
    const ctx = canvasRef.current.getContext("2d")
    axios.get(`http://localhost:5000/image?id=${params.id}`)
      .then(response => {
        const img = new Image()
        img.src = response.data
        img.onload = () => {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      })
  }, [])

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket("ws://localhost:5000/")
      canvasState.setSocket(socket)
      canvasState.setSessionId(params.id)
      toolState.setTool(new Brush(canvasRef.current, socket, params.id))
      socket.onopen = () => {
        console.log("Connection established")
        socket.send(JSON.stringify({
          id: params.id,
          method: "connection",
          username: canvasState.username
        }))
      }
      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        switch(msg.method) {
          case "connection" :
            console.log(`User with name ${msg.username} has been connected`)
            break
          case "draw" :
            drawHandler(msg)
            break
        }
      }
    }
  }, [canvasState.username])

  const onMouseDownHandler = () => {
    canvasState.pushToUndo(canvasRef.current.toDataURL())
    axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
      .then(response => console.log(response.data))
  }
  const onClickHandler = () => {
    canvasState.setUsername(usernameRef.current.value)
    setModal(false)
  }

  const drawHandler = (msg) => {
    const figure = msg.figure
    const ctx = canvasRef.current.getContext("2d")
    switch (figure.type) {
      case "brush" :
        Brush.draw(ctx, figure.x, figure.y, figure.strokeColor, figure.lineWidth)
        break
      case "rect" :
        Rect.staticDraw(ctx, figure.x, figure.y, figure.w, figure.h, figure.fillColor, figure.strokeColor, figure.lineWidth)
        break
      case "circle" :
        Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.fillColor, figure.strokeColor, figure.lineWidth)
        break
      case "eraser" :
        Eraser.draw(ctx, figure.x, figure.y, figure.lineWidth)
        break
      case "line" :
        Line.staticDraw(ctx, figure.x, figure.y, figure.strokeColor, figure.lineWidth)
        break
      case "finish" :
        ctx.beginPath()
        break
    }
  }

  return (
    <div className="canvas">
        <Modal show={modal} onHide={() => {}}>
        <Modal.Header closeButton>
          <Modal.Title>Enter your username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" ref={usernameRef} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => onClickHandler()}>
            Connect
          </Button>
        </Modal.Footer>
      </Modal>
        <canvas onMouseDown={() => onMouseDownHandler()} width={800} height={400} ref={canvasRef} />
    </div>
  )
})

export default Canvas