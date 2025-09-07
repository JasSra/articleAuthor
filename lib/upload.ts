// lib/upload.ts
import { FileService } from '@/api/consolidated';
import { withAuthenticatedAPI, configureConsolidatedAPI } from './consolidatedApi';

export async function uploadFileViaAPI(jwt: string, file: File): Promise<string> {
  return await withAuthenticatedAPI(jwt, async () => {
    try {
      // Upload file using FileService
  const formData = { File: file };
  const result = await FileService.postApiFileUploadAny(formData);
      
      if (result.outcome === 'Success' && result.data) {
        // Get the file ID and create public URL
        const fileId = result.data.id;
        const publicUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229'}/api/file/${fileId}`;
        return publicUrl;
      } else {
        throw new Error(result.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  });
}

// Legacy upload functions for backward compatibility
export async function uploadBase64(jwt: string, base64: string): Promise<string> {
  // Convert base64 to file and use the new upload method
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const file = new File([byteArray], 'upload.jpg', { type: 'image/jpeg' });
  
  return uploadFileViaAPI(jwt, file);
}

export async function uploadFile(jwt: string, file: File): Promise<string> {
  // Use the new FileService upload method
  return uploadFileViaAPI(jwt, file);
}

// Anonymous upload for users not signed in (files may expire per backend policy)
export async function uploadFileAnonymous(file: File): Promise<string> {
  // Configure API without JWT
  configureConsolidatedAPI();
  const formData = { File: file } as any;
  const result: any = await FileService.postApiFileUploadAny(formData);
  if (result?.outcome === 'Success' && result.data) {
    const fileId = result.data.id;
    const publicUrl = `${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5229'}/api/file/${fileId}`;
    return publicUrl;
  }
  throw new Error(result?.message || 'Anonymous upload failed');
}
