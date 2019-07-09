/**
 * Creates a message to be used by the client to display the message and the timestamp
 * @param {string} text The text that is sent with the message
 */
function generateMessage(username: string, text: string) {
	return {
		username,
		text,
		createdAt: new Date().getTime()
	}
}

export default generateMessage;