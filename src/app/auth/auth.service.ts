import Apperror from "../errorHelpers/AppError";
import { IUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
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

    return {
        email: isUserExist.email
    }

}

export const AuthServices = {
    credentialsLogin
}