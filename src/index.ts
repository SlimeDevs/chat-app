import express from "express";
import path from "path";
import http from "http";
import socketio from "socket.io";
import GeoLocation from "./interfaces/GeoLocation";
import { port } from "./util/env";
import Filter from "bad-words";
const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', function(socket) {
	console.log('New WebSocket connection')

	socket.emit('message', 'Welcome!')
	socket.broadcast.emit('message', 'A new user has joined')

	socket.on('sendMessage', (message: string, callback: Function) => {
		// Returns error if message contains profanity
		const filter = new Filter()
		if (filter.isProfane(message)) return callback('Profanity is not allowed!')
		
		// Otherwise, sends message to all clients
		io.emit('message', message)
		callback('Message Delivered!')
	})

	socket.on('sendLocation', (location: GeoLocation, callback: Function) => {
		io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)
		callback('Location Shared')
	})

	socket.on('disconnect', () => {
		io.emit('message', 'A user has left')
	})
})

server.listen(port, () => {
	console.log(`Server is online on port ${port}`)
})