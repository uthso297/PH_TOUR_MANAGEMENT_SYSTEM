import { NextFunction, Request, Response } from "express"
import Apperror from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { JwtPayload } from 'jsonwebtoken'
import { envVars } from "../config/env"
import httpStatus from 'http-status-codes'
import { User } from "../modules/user/user.model"
import { IsActive } from "../modules/user/user.interface"

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new Apperror(404, 'token not found')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new Apperror(httpStatus.BAD_REQUEST, "User doesn't Exist")
        }

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new Apperror(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            throw new Apperror(httpStatus.BAD_REQUEST, 'User is deleted')
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new Apperror(403, 'you are not permitted in this route')
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}