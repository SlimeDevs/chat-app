const socket = io() // Starts websocket

// Displays received messages
socket.on('message', (messageValue) => {
	console.log(messageValue)
})

// Sends the message to the chatroom
document.querySelector('#message-form').addEventListener('submit', (event) => {
	event.preventDefault() // Stops browser reload
	const message = event.target.elements.message.value;

	socket.emit('sendMessage', message, (error) => {
		if (error) {
			return console.log(error)
		}

		console.log('Message delivered!')
	})
})

document.querySelector('#send-location').addEventListener('click', () => {
	// Alert if geolocation is not supported
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	// Uses browser geolocation to share your location with the entire chatroom
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', { 
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			console.log('Location Shared!')
		})
	})
})