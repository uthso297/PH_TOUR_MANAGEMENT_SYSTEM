import { NextFunction, Request, Response } from "express"
import Apperror from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from 'jsonwebtoken'
import { envVars } from "../config/env"


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new Apperror(404, 'token not found')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload
        if (!authRoles.includes(verifiedToken.role)) {
            throw new Apperror(403, 'you are not permitted in this route')
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}