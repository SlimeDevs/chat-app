import dotenv from "dotenv"; // Imports dotenv

// Uses dotenv if not in production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config()
}

// Defines the current environment type using NODE_ENV
const env: string | undefined = process.env.NODE_ENV;
if (!env) throw new Error('Node environment variable not found')
const envString: string = env.toUpperCase();

// Sets port to a current environment variable, or 3000 if none is found
const port: string | number = 
    process.env.PORT || 
    process.env['PORT_' + envString] ||
    3000;

// Exports the environment variables
export { port }