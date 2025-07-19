/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import { catchAsync } from "../utils/catchAsync"
import { sendResponse } from "../utils/sendResponse"
import Apperror from "../errorHelpers/AppError"
import { setAuthCookie } from "../utils/setCookie"
import { JwtPayload } from "jsonwebtoken"
import { createUserTokens } from "../utils/userTokens"
import { envVars } from "../config/env"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)

    // res.cookie('refreshToken', loginInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    // res.cookie('accessToken', loginInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged In Successfully",
        data: loginInfo,
    })
})

const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    // const refreshToken = req.headers.authorization
    if (!refreshToken) {
        throw new Apperror(httpStatus.BAD_REQUEST, 'No refresh token received from cookies')
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    // res.cookie('accessToken', tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    setAuthCookie(res, tokenInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "New access token retrived Successfully",
        data: tokenInfo,
    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user
    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password changed Successfully",
        data: null,
    })
})

const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ''

    if (redirectTo.startsWith('/')) {
        redirectTo = redirectTo.slice(1)
    }

    const user = req.user
    if (!user) {
        throw new Apperror(httpStatus.NOT_FOUND, 'User not found')
    }
    const tokenInfo = createUserTokens(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallbackController
}