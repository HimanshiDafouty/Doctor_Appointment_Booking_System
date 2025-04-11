import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

console.log("Admin Email:", process.env.ADMIN_EMAIL);
console.log("Admin Password:", process.env.ADMIN_PASSWORD);
console.log("JWT Secret:", process.env.JWT_SECRET);


// app config
const app = express()
const port = process.env.PORT  || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors()) // connects frontend to backend

// api endpoints
app.use('/api/admin', adminRouter) // localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)


app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log("Server Started At PORT", port))