//server kis port pe run hoga , kya api hit hone pe kya response milega, etc
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();
const port  = process.env.PORT || 4000;

await connectDB() // jab tak mongodb connnect na ho jaye wait karo
await connectCloudinary() // jab tak cloudinary connnect na ho jaye wait karo

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173'] // this is the URL of Frontend

// MiddleWare Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

//API call ka starting yahi hai
app.get('/', (req, res) => res.send("API is Working"));
app.use('/api/user', userRouter) // here we are doing /api/user and after that ex-/api/user/login or logout etc- are done in userRoute.js
app.use('/api/seller', sellerRouter) // here we are doing /api/seller and after that ex-/api/seller/login or logout etc- are done in sellerRoute.js
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter) // here we are doing /api/cart and after that ex-/api/cart/update or etc- are done in cartRoute.js
app.use('/api/address', addressRouter) // here we are doing /api/address and after that ex-/api/address/add or get etc- are done in addressRoute.js
app.use('/api/order', orderRouter) //


app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})
