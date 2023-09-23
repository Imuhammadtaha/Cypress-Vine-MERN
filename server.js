import express from "express";
import dotenv from 'dotenv';
// import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import morgan from "morgan";
import connectDB from "./config/db.js";
import userModels from "./models/userModels.js";
import authRoute from './routes/authRoute.js'
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { fileURLToPath } from "url";
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


//configure env
dotenv.config();




const PORT = process.env.PORT || 5000;
// const JWT_SECRET = "HELLO WAHA SE HATO";
const app = express();
// middleware function 
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// connection with database
connectDB();

// Schemas
userModels;


//routing
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productRoutes);



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
  

app.listen(PORT,()=>{
    console.log(`Server is listening on Port http://localhost:${PORT}`);
});