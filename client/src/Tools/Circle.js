import Tool from "./Tool"

export default class Circle extends Tool {
    constructor(canvas, socket, id) {
        super(canvas, socket, id )
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
            this.currentX = e.pageX - e.target.offsetLeft
            this.currentY = e.pageY - e.target.offsetTop
            this.width = this.currentX - this.firstX
            this.height = this.currentY - this.firstY
            this.radius = Math.sqrt(this.width**2 + this.height**2)
            this.socket.send(JSON.stringify({
                id: this.id,
                method: "draw",
                figure: {
                    type: "circle",
                    x: this.firstX,
                    y: this.firstY,
                    r: this.radius,
                    fillColor: this.ctx.fillStyle,
                    strokeColor: this.ctx.strokeStyle,
                    lineWidth: this.ctx.lineWidth
                }
            }))
            this.draw(this.firstX, this.firstY, this.radius)
        }
    }
    draw (x, y, r) {
        const img = new Image()
        img.src = this.saved
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath()
            this.ctx.arc(x, y, r, 0, 2 * Math.PI)
            this.ctx.fill()
            this.ctx.stroke()
        }
    }
    static staticDraw (ctx, x, y, r, fillColor, strokeColor, lineWidth) {
        ctx.fillStyle = fillColor
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}