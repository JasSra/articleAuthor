// lib/upload.ts
import { createApiClient } from './apiClient';

export async function uploadBase64(jwt: string, base64: string): Promise<string> {
  const api = createApiClient({ jwt });
  
  // Using a placeholder form ID - this will be replaced with actual form ID from seeding
  const UPLOAD_FORM_ID = '{{ UPLOAD_FORM_ID }}';
  
  const res = await api.submitForm(UPLOAD_FORM_ID, { file: base64 });
  return res.url;
}

export async function uploadFile(jwt: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        // Remove data:image/...;base64, prefix
        const base64Data = base64.split(',')[1];
        const url = await uploadBase64(jwt, base64Data);
        resolve(url);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}
