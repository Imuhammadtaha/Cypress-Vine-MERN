import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/Ecommerece', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Hurray Connected to MongoDB Database ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error in MongoDB: ${error}`);
  }
};

export default connectDB;
