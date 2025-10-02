import imageCompression from "browser-image-compression";

export async function compressImage(imageFile, options = {}) {
  const defaultOptions = {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(imageFile, {
      ...defaultOptions,
      ...options,
    });

    const previewUrl = URL.createObjectURL(compressedFile);

    return { compressedFile, previewUrl };
  } catch (error) {
    console.error("Image compression error:", error);
    throw error;
  }
}
