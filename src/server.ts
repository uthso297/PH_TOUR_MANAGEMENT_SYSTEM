/* eslint-disable no-console */
import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import { envVars } from './app/config/env'

let server: Server


const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log('Connectet to mongodb😍');

        server = app.listen(envVars.PORT, () => {
            console.log(`Server is listening on port ${envVars.PORT} 😊`);
        })
    } catch (error) {
        console.log(error);
    }
}

startServer();
// 1
process.on("unhandledRejection", (err) => {
    console.log("Unhandeled rejection detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})
// 1 example
// Promise.reject(new Error("I forgot to catch this promise"))

// 2
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// 2
// throw new Error("I forgot to handle this local error")

// 3
process.on("SIGTERM", (err) => {
    console.log("SIGNAL TERMINATION detected....server shutting down", err);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})

// 4 (SIGIN)
process.on("SIGINT", () => {
    console.log("SIGIN detected....server shutting down");
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1)
})


/*

1.unhandeled rejection error
2.uncaught rejection error
3.signal termination system

*/
