import Tool from "./Tool"

export default class Line extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id)
        this.listen()
    }

    listen () {
        this.canvas.onmousemove = this.onMouseMoveHandler.bind(this)
        this.canvas.onmouseup = this.onMouseUpHandler.bind(this)
        this.canvas.onmousedown = this.onMouseDownHandler.bind(this)
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
        this.ctx.beginPath()
        this.firstX = e.pageX - e.target.offsetLeft
        this.firstY = e.pageY - e.target.offsetTop
        this.saved = this.canvas.toDataURL()
    }
    onMouseMoveHandler (e) {
        if (this.mouseDown) {
            this.socket.send(JSON.stringify({
                id: this.id,
                method: "draw",
                figure: {
                    type: "line",
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    strokeColor: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
            this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
        }
    }
    draw (x, y) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.moveTo(this.firstX, this.firstY)
            this.ctx.lineTo(x, y)
            this.ctx.stroke()
        }
    }
    static staticDraw (ctx, x, y, strokeColor, lineWidth) {
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(this.firstX, this.firstY)
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}