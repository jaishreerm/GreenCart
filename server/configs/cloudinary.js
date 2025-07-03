// in configs/cloudinary we are connecting to cloudinary to upload images

import {v2 as cloudinary} from "cloudinary"

const connectCloudinary = async () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET,
    })
}

export default connectCloudinary;