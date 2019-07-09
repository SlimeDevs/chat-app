/**
 * Creates a location message to be used by the client to display the location url and the timestamp
 * @param {string} url The url that is sent with the location message
 */
function generateLocation(url: string) {
	return {
		url,
		createdAt: new Date().getTime()
	}
}

export default generateLocation;