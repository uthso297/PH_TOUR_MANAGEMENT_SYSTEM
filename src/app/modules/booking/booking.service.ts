/* eslint-disable @typescript-eslint/no-explicit-any */
import Apperror from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import httpStatus from 'http-status-codes'
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Tour } from "../tour/tour.model";
import { ISSLCommerz } from "../SSLCommerz/sslCommerz.interface";
import { SSLService } from "../SSLCommerz/sslCommerz.service";
import { getTransactionId } from "../../utils/getTransactionId";


const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()

    try {

        const user = await User.findById(userId)

        if (!user?.phone || !user?.address) {
            throw new Apperror(httpStatus.BAD_REQUEST, "Please update your profile to Book a Tour")
        }

        const tour = await Tour.findById(payload.tour).select("costFrom")

        if (!tour?.costFrom) {
            throw new Apperror(httpStatus.BAD_REQUEST, 'No tour cost found!')
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const amount = Number(tour.costFrom) * Number(payload.guestCount!)

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload,

        }], { session })

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session })
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")

        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhone = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayLoad: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhone,
            name: userName,
            transactionId: transactionId,
            amount: amount
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayLoad)

        await session.commitTransaction()
        session.endSession()
        return {
            booking: updatedBooking,
            paymentUrl: sslPayment.GatewayPageURL
        }

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
    }


};


const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};