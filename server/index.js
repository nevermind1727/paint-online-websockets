import express from "express"
import WSServer from "express-ws"
import cors from "cors"
import dotenv from "dotenv"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'
dotenv.config()

const PORT = process.env.PORT
const app = express()
const wsserver = WSServer(app)
const aWss = wsserver.getWss()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

app.ws("/", (ws, req) => {
    ws.on("message", (msg) => {
        msg = JSON.parse(msg)
        switch (msg.method) {
            case "connection" :
                connectionHandler(ws, msg)
                break
            case "draw" :
                broadcastConnection(ws, msg)
                break
        }
    })
})

app.post("/image" , (req, res) => {
    try {
        const img = req.body.img.replace("data:image/png;base64,", "")
        fs.writeFileSync(path.resolve(__dirname, "images", `${req.query.id}.jpg`), img, "base64")
        res.json({message: "Image downloaded"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

app.get("/image" , (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, "images", `${req.query.id}.jpg`))
        const dataImage = "data:image/png;base64," + file.toString("base64")
        res.json(dataImage)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
})

const connectionHandler = (ws, msg) => {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id){
            client.send(JSON.stringify(msg))
        }
    })
}

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))