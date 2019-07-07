const socket = io()

socket.on('message', (messageValue) => {
	console.log(messageValue)
})

document.querySelector('#message-form').addEventListener('submit', (event) => {
	event.preventDefault() // Stops browser reload
	const message = event.target.elements.message;
	socket.emit('sendMessage', message)
})