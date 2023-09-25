import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect('mongodb+srv://mmuhammadtaha786:UMGwje4cr00ayMSU@cluster0.4s8vjfh.mongodb.net/Ecommerece',{
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log(`Hurray Connected to Mongodb Database ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error in Mongo Db ${error}`);
        
    }
}
export default connectDB;
