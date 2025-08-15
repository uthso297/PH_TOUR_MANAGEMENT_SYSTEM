import cookieParser from 'cookie-parser'
import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/Routes'
import './app/config/passport'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import passport from 'passport'
import expressSession from 'express-session'
import { envVars } from './app/config/env'
const app = express()

app.use(expressSession({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.set("trust proxy", 1)
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1', router)
// route matching -> controller -> service -> model -> DB

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Tour Management System Backend Server☺️"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app