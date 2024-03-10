import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);

cloudinary.config({
  cloud_name: 'dmwmwsuws',
  api_key: 894796938191585,
  api_secret: '3jzHjOiO4Otb9pkCtW0AL7LmolU',
  // cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.API_KEY,
  // api_secret: process.env.API_SECRET,
});

export default cloudinary;
