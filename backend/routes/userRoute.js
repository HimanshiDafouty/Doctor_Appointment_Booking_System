import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorpay, verifyAayushman } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
// import AayushmanCard from '../models/aayushmanModel.js';
// import appointmentModel from '../models/appointmentModel.js';

const userRouter = express.Router()
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay', authUser, paymentRazorpay)
userRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

userRouter.post('/verify-aayushman', authUser, verifyAayushman)

export default userRouter

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Y2QxNjk4OTRkNmMwYmNlYTc3ZTgwNiIsImlhdCI6MTc0MTQ5NjYyMH0.bM4NrrRq0SvbvfUwTMumbOMgwUwkCCCATyoTeApi9u0