import Tool from "./Tool"

export default class Eraser extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        this.listen()
    }
    listen() {
        this.canvas.onmouseup = this.onMouseUpHandler.bind(this)
        this.canvas.onmousedown = this.onMouseDownHandler.bind(this)
        this.canvas.onmousemove = this.onMouseMoveHandler.bind(this)
    }
    onMouseUpHandler (e) {
        this.mouseDown = false
        this.socket.send(JSON.stringify({
            id: this.id,
            method: "draw",
            figure: {
                type: "finish"
            }
        }))
    }
    onMouseDownHandler (e) {
        this.mouseDown = true
        this.ctx.strokeStyle = "white"
        this.ctx.beginPath()
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }
    onMouseMoveHandler (e) {
        if (this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
            id: this.id,
            method: "draw",
            figure: {
                type: "brush",
                x: e.pageX - e.target.offsetLeft,
                y: e.pageY - e.target.offsetTop,
                lineWidth: this.ctx.lineWidth
            }
        }))
        }
    }

    static draw (ctx, x, y, lineWidth) {
        ctx.lineWidth = lineWidth
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}