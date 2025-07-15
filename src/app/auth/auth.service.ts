import Apperror from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { generateToken } from "../utils/jwt";
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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES)


    return {
        // email: isUserExist.email
        accessToken,
    }

}

export const AuthServices = {
    credentialsLogin
}