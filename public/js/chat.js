const socket = io() // Starts websocket

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


// Displays received messages
socket.on('message', (messageValue) => {
	console.log(messageValue)
	const html = Mustache.render(messageTemplate, {
		message: messageValue.text,
		createdAt: moment(messageValue.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

// Displays received locations
socket.on('locationMessage', (locationValue) => {
	console.log(locationValue)
	const html = Mustache.render(locationTemplate, {
		location: locationValue.url,
		createdAt: moment(locationValue.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
})

// Sends the message to the chatroom
$messageForm.addEventListener('submit', (event) => {
	event.preventDefault() // Stops browser reload
	$messageFormButton.setAttribute('disabled', 'disabled') // Disables form until message is acknowledged

	const message = event.target.elements.message.value

	socket.emit('sendMessage', message, (error) => {
		$messageFormButton.removeAttribute('disabled')
		$messageFormInput.value = ''
		$messageFormInput.focus()

		if (error) {
			return console.log(error)
		}

		console.log('Message delivered!')
	})
})

// Sends your location to the chatroom
document.querySelector('#send-location').addEventListener('click', () => {
	// Alert if geolocation is not supported
	if (!navigator.geolocation) {
		return alert('Geolocation is not supported by your browser')
	}

	$sendLocationButton.setAttribute('disabled', 'disabled') // Disables form until message is acknowledged

	// Uses browser geolocation to share your location with the entire chatroom
	navigator.geolocation.getCurrentPosition((position) => {
		socket.emit('sendLocation', { 
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		}, () => {
			$sendLocationButton.removeAttribute('disabled')
			console.log('Location Shared!')
		})
	})
})

socket.emit('join', { username, room })