/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    if (envVars.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log(err);
    }


    let statusCode = 500
    let message = `Something went wrong!! ${err.message}`
    // console.log('Error instance of AppError:', err instanceof AppError);
    const errorSources: any = []

    if (err.code === 11000) {
        const matchedArray = err.message.match(/"([^"]*)"/)
        statusCode = 400
        message = `${matchedArray[1]} already exist`
    }

    else if (err.name === 'ZodError') {
        statusCode = 400
        message = 'Zod Error'

        err.issues.forEach((issue: any) => {
            errorSources.push({
                path: issue.path[0],
                message: issue.message
            })
        })
    }

    else if (err.name === 'CastError') {
        statusCode = 400
        message = 'Invalid MongoDB Object Id'
    }

    else if (err.name === 'ValidationError') {
        statusCode = 400
        const errors = Object.values(err.errors)

        errors.forEach((errorObject: any) => errorSources.push({
            path: errorObject.path,
            message: errorObject.message
        }))
        // console.log(errorSources);
        message = "Validation Error Occur"
    }

    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}