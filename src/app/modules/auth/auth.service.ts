/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Apperror from "../../errorHelpers/AppError";
// import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from 'http-status-codes'
import bcryptjs from 'bcryptjs'
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import { IAuthProvider, IsActive } from "../user/user.interface";
import { sendEmail } from "../../utils/sendEmail";


// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;

//     const isUserExist = await User.findOne({ email })

//     if (!isUserExist) {
//         throw new Apperror(httpStatus.BAD_REQUEST, "User doesn't Exist")
//     }

//     const isPassWordMatch = await bcryptjs.compare(password as string, isUserExist.password as string)

//     if (!isPassWordMatch) {
//         throw new Apperror(httpStatus.BAD_REQUEST, "Incorrect Password")
//     }

//     const userTokens = createUserTokens(isUserExist)

//     // const userObj = isUserExist.toObject(); // Convert to plain JS object
//     // delete userObj.password;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject()
//     return {
//         // email: isUserExist.email
//         accessToken: userTokens.accessToken,
//         refreshToken: userTokens.refreshToken,
//         user: rest
//     }

// }
const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        // email: isUserExist.email
        accessToken: newAccessToken
    }

}


const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Apperror(404, "User not found");
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new Apperror(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}



const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new Apperror(httpStatus.UNAUTHORIZED, 'Old password does not match')
    }
    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))
    user!.save()
}


const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new Apperror(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isVerified) {
        throw new Apperror(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new Apperror(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new Apperror(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    /**
     * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
     */
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new Apperror(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new Apperror(401, "User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}


export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    changePassword,
    setPassword,
    forgotPassword,
    resetPassword
}