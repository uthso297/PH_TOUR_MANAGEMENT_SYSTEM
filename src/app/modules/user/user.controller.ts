/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import httpsStatus from 'http-status-codes'
import { UserServices } from "./user.service";

const createUer = async (req: Request, res: Response) => {
    try {
        const user = await UserServices.createUserService(req.body)
        
        res.status(httpsStatus.CREATED).json({
            message: "User created successfully",
            user
        })

    } catch (error: any) {
        console.log(error);
        res.send(httpsStatus.BAD_REQUEST).json({
            message: `Something went wrong ${error.message}`
        })
    }
}


export const UserController = {
    createUer
}