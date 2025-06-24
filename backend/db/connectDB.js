import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    const conn = await mongoose.connect(dbURI);
    
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit the process with failure
  }
}