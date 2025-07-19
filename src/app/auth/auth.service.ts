/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Apperror from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new Apperror(httpStatus.BAD_REQUEST, "User doesn't Exist")
    }

    const isPassWordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPassWordMatch) {
        throw new Apperror(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const userTokens = createUserTokens(isUserExist)

    // const userObj = isUserExist.toObject(); // Convert to plain JS object
    // delete userObj.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject()
    return {
        // email: isUserExist.email
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest
    }

}
const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        // email: isUserExist.email
        accessToken: newAccessToken
    }

}

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new Apperror(httpStatus.UNAUTHORIZED, 'Old password does not match')
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}