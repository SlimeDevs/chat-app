import express from "express";
import path from "path";
import http from "http";
import socketio from "socket.io";
import GeoLocation from "./interfaces/GeoLocation";
import { port } from "./util/env";
import { addUser, removeUser, getUser, getUsersInRoom } from "./util/users"
import generateMessage from "./util/message";
import generateLocation from "./util/location"
import Filter from "bad-words";
import User from "./interfaces/User";
const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', function(socket) {
	console.log('New WebSocket connection')

	socket.on('join', ({ username, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, username, room})
		if (error) return callback(error)
		if (!user) return callback('There was an error creating the user')

		socket.join(user.room)

		socket.emit('message', generateMessage('Server', 'Welcome!'))
		socket.broadcast.to(user.room).emit('message', generateMessage('Server', `${user.username} has joined!`))
		io.to(user.room).emit('roomData', {
			room: user.room,
			users: getUsersInRoom(user.room)
		})

		callback()
	})

	socket.on('sendMessage', (message: string, callback: Function) => {
		const user = getUser(socket.id)
		if (!user) return callback('There was an finding creating the user')

		// Returns error if message contains profanity
		const filter = new Filter()
		if (filter.isProfane(message)) return callback('Profanity is not allowed!')
		
		// Otherwise, sends message to all clients
		io.to(user.room).emit('message', generateMessage(user.username, message))
		callback('Message Delivered!')
	})

	socket.on('sendLocation', (location: GeoLocation, callback: Function) => {
		const user = getUser(socket.id)
		if (!user) return callback('There was an finding creating the user')

		io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`))
		callback('Location Shared')
	})

	socket.on('disconnect', () => {
		const user = removeUser(socket.id)
		if (user) {
			io.to(user.room).emit('message', generateMessage('Server', `${user.username} has left!`))
			io.to(user.room).emit('roomData', {
				room: user.room,
				users: getUsersInRoom(user.room)
			})
		}
	})
})

server.listen(port, () => {
	console.log(`Server is online on port ${port}`)
})