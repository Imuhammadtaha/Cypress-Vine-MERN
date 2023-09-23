import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log(`Hurray Connected to Mongodb Database ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error in Mongo Db ${error}`);
        
    }
}
export default connectDB;
