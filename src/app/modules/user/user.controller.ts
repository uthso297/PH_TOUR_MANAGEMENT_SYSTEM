/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpsStatus from 'http-status-codes'
import { UserServices } from "./user.service";

const createUer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUserService(req.body)

        res.status(httpsStatus.CREATED).json({
            message: "User created successfully",
            user
        })

    } catch (err: any) {
        // console.log(error);
        next(err)
    }
}


export const UserController = {
    createUer
}