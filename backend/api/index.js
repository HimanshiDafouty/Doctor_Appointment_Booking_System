import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import serverless from 'serverless-http'
import connectDB from '../config/mongodb.js'
import connectCloudinary from '../config/cloudinary.js'
import adminRouter from '../routes/adminRoute.js'
import doctorRouter from '../routes/doctorRoute.js'
import userRouter from '../routes/userRoute.js'

// Connect to MongoDB and Cloudinary
connectDB()
connectCloudinary()

// Create express app
const app = express()
app.use(express.json())
app.use(cors())

// Add your routes
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Test route
app.get('/', (req, res) => {
  res.send('API WORKING')
})

// This makes it work on Vercel
export default serverless(app)
