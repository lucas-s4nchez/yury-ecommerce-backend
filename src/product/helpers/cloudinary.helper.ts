import { v2 as cloudinary } from "cloudinary";
export const uploadImageToCloudinary = async (
  filePath: any,
  folder: string
) => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
  });
};

export const deleteImageFromCloudinary = async (publicId: any) => {
  return await cloudinary.uploader.destroy(publicId);
};
