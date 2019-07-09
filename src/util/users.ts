import User from "../interfaces/User";

const users: User[] = []

/**
 * Adds a user to the user array
 * @param {User} User Contains the id, username, and room strings
 * @returns {User} Returns the user that has been created
 */
function addUser({ id, username, room }: User) {
	// Clean the data
	username = username.trim().toLowerCase()
	room = room.trim().toLowerCase()

	// Validate the data
	if (!username || !room) {
		return {
			error: 'Username and room are required'
		}
	}

	// Check for existing user
	const existingUser: User | undefined = users.find((user) => {
		return user.room === room && user.username === username
	})

	// Validate username
	if (existingUser) {
		return {
			error: 'Username is in use!'
		}
	}

	// Store user
	const user: User = { id, username, room }
	users.push(user)
	return { user }
}

/**
 * Removes a user from the user array
 * @param {string} id The id used to find the user 
 * @returns {array} An array containing only the removed user object
 */
function removeUser(id: string) {
	const index: number = users.findIndex((user) => user.id === id) 
	if (index !== -1) {
		return users.splice(index, 1)[0]
	}
}

/**
 * Searches for and then returns the user by their id
 * @param {string} id The id used to find the user
 * @returns {User} Returns the user object
 */
function getUser(id: string) {
	return users.find((user) => user.id === id)
}

/**
 * Searches for and then returns all users in a room
 * @param {string} room The room that you want to search
 * @returns {User[]} Returns all users in specified room
 */
function getUsersInRoom(room: string) {
	return users.filter((user) => user.room === room)
}

export {
	getUser,
	getUsersInRoom,
	addUser,
	removeUser
}