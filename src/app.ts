import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/Routes'
import { globalErrorHandler } from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'

const app = express()
app.use(express.json())
app.use(cors())

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