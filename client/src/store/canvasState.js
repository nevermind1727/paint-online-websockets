import {makeAutoObservable} from "mobx"

class CanvasState {
    canvas = null
    redoList = []
    undoList = []
    sessionId = null
    username = null
    socket = null
    constructor() {
        makeAutoObservable(this)
    }
    setCanvas(canvas) {
        this.canvas = canvas
    }
    setSessionId(sessionId) {
        this.sessionId = sessionId
    }
    setUsername(username) {
        this.username = username
    }
    setSocket(socket) {
        this.socket = socket
    }
    pushToUndo (data) {
        this.undoList.push(data)
    }
    pushToRedo (data) {
        this.redoList.push(data)
    }
    undo () {
        let ctx = this.canvas.getContext("2d")
        if (this.undoList.length > 0) {
            let data = this.undoList.pop()
            this.redoList.push(this.canvas.toDataURL())
            const img = new Image()
            img.src = data
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        } else {
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }
    redo () {
        let ctx = this.canvas.getContext("2d")
        if (this.redoList.length > 0) {
            let data = this.redoList.pop()
            this.undoList.push(this.canvas.toDataURL())
            const img = new Image()
            img.src = data
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            }
        }
    }
}

export default new CanvasState()