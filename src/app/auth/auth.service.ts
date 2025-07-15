import Apperror from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { createUserTokens } from "../utils/userTokens";
import { generateToken, verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
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
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new Apperror(httpStatus.BAD_REQUEST, "User doesn't Exist")
    }

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new Apperror(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new Apperror(httpStatus.BAD_REQUEST, 'User is deleted')
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        // email: isUserExist.email
        accessToken
    }

}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}