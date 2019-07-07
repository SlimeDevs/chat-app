import express from "express";
import path from "path";
import http from "http";
import socketio from "socket.io";
import { port } from "./util/env";
const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', function(socket) {
	console.log('New WebSocket connection')
	socket.emit('message', 'Welcome!')
	socket.on('sendMessage', (message: string) => {
		console.log(message)
		io.emit('message', message)
	})
})

server.listen(port, () => {
	console.log(`Server is online on port ${port}`)
})