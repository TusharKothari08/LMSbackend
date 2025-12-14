import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks,stripeWebhooks  } from './controllers/webhooks.js';
import serverless from 'serverless-http';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';
import Stripe from 'stripe';
import morgan from 'morgan';
import bodyparser from "body-parser"


const app=express();

//connect DB
await connectDB();
await connectCloudinary();
// console.log("heheh")

// middlewares
app.use(morgan("tiny"))
app.use(cors());
app.use(clerkMiddleware());


//Routes
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks);
app.post('/clerk',bodyparser.raw({type:"application/json"}),clerkWebhooks);
app.get('/',(req,res)=>res.send("API Working"))

const PORT=5000;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})

export default serverless(app);