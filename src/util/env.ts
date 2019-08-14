import dotenv from "dotenv"; // Imports dotenv
dotenv.config() // Loads .env file, if it exists

// Allow numbers for the port variable
interface IPort {
    port: String | Number | undefined
}

// Sets the env variables as the current environment variables
let {
    port
}: NodeJS.ProcessEnv | IPort = process.env;

// Sets port 80 to default port if none is found
if (!port) {
    port = 80;
}

// Exports the env vars
export { port }