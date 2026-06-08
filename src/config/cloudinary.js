const cloudinary = require("cloudinary").v2;
const env = require("./env");

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key:    env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Upload buffer lên Cloudinary, trả về URL
async function uploadImage(buffer, folder = "products") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// Xóa ảnh theo public_id (lấy từ URL)
async function deleteImage(imageUrl) {
  // URL dạng: https://res.cloudinary.com/<cloud>/image/upload/v123/products/abc.jpg
  // public_id = "products/abc"
  const parts = imageUrl.split("/");
  const fileName = parts[parts.length - 1].split(".")[0];
  const folder   = parts[parts.length - 2];
  const publicId = `${folder}/${fileName}`;
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadImage, deleteImage };