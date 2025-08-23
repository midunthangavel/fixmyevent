import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,

  UploadResult
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

export class StorageService {
  private storageRef = storage;

  // Upload a single file
  async uploadFile(
    file: File, 
    path: string, 
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): Promise<string> {
    try {
      const storageRef = ref(this.storageRef, path);
      const uploadResult: UploadResult = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[], 
    basePath: string,
    metadata?: { contentType?: string; customMetadata?: Record<string, string> }
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}-${index}-${file.name}`;
        const filePath = `${basePath}/${fileName}`;
        return this.uploadFile(file, filePath, metadata);
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple files:', error);
      throw error;
    }
  }

  // Get download URL for a file
  async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storageRef, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting download URL:', error);
      throw error;
    }
  }

  // Delete a file
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storageRef, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  // Delete multiple files
  async deleteMultipleFiles(paths: string[]): Promise<void> {
    try {
      const deletePromises = paths.map(path => this.deleteFile(path));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting multiple files:', error);
      throw error;
    }
  }

  // List all files in a directory
  async listFiles(path: string): Promise<string[]> {
    try {
      const storageRef = ref(this.storageRef, path);
      const result = await listAll(storageRef);
      return result.items.map(item => item.fullPath);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  // Generate a unique file path
  generateFilePath(originalName: string, basePath: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    return `${basePath}/${fileName}`;
  }

  // Validate file type
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // Validate file size
  validateFileSize(file: File, maxSizeInMB: number): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  // Get file metadata
  getFileMetadata(file: File): {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  } {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    };
  }
}

// Export service instance
export const storageService = new StorageService();
