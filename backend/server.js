import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import orderRouter from './routes/orderRoute.js'
import userRouter from './routes/userRoute.js'
import cartRouter from './routes/cartRoute.js';
import paymentRouter from './routes/paymentRoute.js'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const port = 4000

app.use(express.json())
app.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Configure static file serving
app.use('/images/profiles', express.static(path.join(__dirname, 'public', 'profiles')));
app.use('/images', express.static(path.join(__dirname, 'uploads')));

//db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
// app.use("/images", express.static('uploads'))
app.use('/api/order', orderRouter)
app.use('/api/user', userRouter)  // This is important for the review routes
app.use('/api/cart', cartRouter)
// Payment route
app.use('/api/payment', paymentRouter);

app.get("/", (req, res) => {
    res.send("API working")
})

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`)
})