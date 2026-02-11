/**
 * Compress image file before upload
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum size in megabytes (default: 0.5MB)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default: 1920)
 * @returns Promise with compressed base64 string
 */
export const compressImage = (
  file: File,
  maxSizeMB: number = 0.5,
  maxWidthOrHeight: number = 1920
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidthOrHeight) {
            height = (height * maxWidthOrHeight) / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width = (width * maxWidthOrHeight) / height;
            height = maxWidthOrHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Draw image on canvas with new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with quality 0.9 and reduce if needed
        let quality = 0.9;
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Keep reducing quality until size is acceptable
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        while (compressedDataUrl.length > maxSizeBytes && quality > 0.1) {
          quality -= 0.1;
          compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        
        resolve(compressedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get size of base64 string in MB
 */
export const getBase64SizeMB = (base64String: string): number => {
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / (1024 * 1024);
};

/**
 * Validate and compress image if needed
 */
export const processImageFile = async (
  file: File,
  maxSizeMB: number = 0.5
): Promise<{ success: boolean; data?: string; error?: string }> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }
    
    // Check if compression is needed
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB <= maxSizeMB) {
      // File is small enough, just convert to base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ success: true, data: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Compress the image
    const compressed = await compressImage(file, maxSizeMB);
    const compressedSizeMB = getBase64SizeMB(compressed);
    
    console.log(`Image compressed: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB`);
    
    return { success: true, data: compressed };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Error al procesar la imagen' 
    };
  }
};
