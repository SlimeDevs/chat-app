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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

// Autoscroll function
function autoScroll() {
	// Grabs new message
	const $newMessage = $messages.lastElementChild

	// Find height of new message
	const newMessageStyles = getComputedStyle($newMessage)
	const newMessageMargin = parseInt(newMessageStyles.marginBottom)
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

	// Find visible height
	const visibleHeight = $messages.offsetHeight

	// Height of messages container
	const containerHeight = $messages.scrollHeight
	
	// How far the client is currently scrolled
	const scrollOffset = $messages.scrollTop + visibleHeight

	if (containerHeight - newMessageHeight <= scrollOffset) { // If client was at the bottom of the page, autoscroll
		$messages.scrollTop = $messages.scrollHeight
	} // Otherwise, don't autoscroll
}

// Displays received messages
socket.on('message', (messageValue) => {
	const html = Mustache.render(messageTemplate, {
		username: messageValue.username,
		message: messageValue.text,
		createdAt: moment(messageValue.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoScroll()
})

// Displays received locations
socket.on('locationMessage', (locationValue) => {
	const html = Mustache.render(locationTemplate, {
		username: locationValue.username,
		location: locationValue.url,
		createdAt: moment(locationValue.createdAt).format('h:mm a')
	})
	$messages.insertAdjacentHTML('beforeend', html)
	autoScroll()
})

// Room data for sidebar
socket.on('roomData', ({room, users}) => {
	const html = Mustache.render(sidebarTemplate, {
		room,
		users
	})
	document.querySelector('#sidebar').innerHTML = html
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

// Attempts to join the room
socket.emit('join', { username, room }, (error) => {
	if (error) {
		alert(error)
		location.href = '/'
	}
})