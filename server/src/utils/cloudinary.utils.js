import { v2 as cloudinary } from 'cloudinary';

const uploadImageToCloudinary = async (buffer) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        if (!buffer) {
            console.log("No buffer found.");
            return null;
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: "auto" },
                (error, result) => {
                    if (error) {
                        console.error("Error uploading to Cloudinary:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(buffer);
        });

        console.log("Upload successful:", uploadResult.url);
        return uploadResult;
    } catch (error) {
        console.error("Error in Cloudinary upload:", error);
        return null;
    }
};

const deleteImageFromCloudinary = async (publicId) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted:', result);
    } catch (error) {
        console.error('Error deleting image:', error);
    }
};

export { uploadImageToCloudinary,deleteImageFromCloudinary };