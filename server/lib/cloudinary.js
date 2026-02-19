import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import sharp from "sharp";
import fs from "fs";
import path from "path";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (imgBuffer, fileName) => {
  // Create home folder path
  const outputDir = path.join(process.cwd(), "linkedin-clone", "home");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${fileName}.webp`);

  // Resize + Compress using sharp
  await sharp(imgBuffer)
    .resize(800, 800, {
      fit: "inside", // keeps aspect ratio
    })
    .webp({ quality: 70 }) // reduces size
    .toFile(outputPath);

  // Optional: Upload resized file to Cloudinary
  const result = await cloudinary.uploader.upload(outputPath);

  return {
    localPath: outputPath,
    cloudUrl: result.secure_url,
  };
};

export default uploadImage;
