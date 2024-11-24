// utils/cloudinary.utils.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET

    cloud_name: "dsfhlrscg",
    api_key: "912145273567971",
    api_secret: "zbk_GnGZ7nFE8FPOqhYieglqJPM"

});

export default cloudinary;