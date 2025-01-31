//  
import { randomBytes } from 'crypto';
export function generateUniqueFileName(originalName: string): string {
    //  
    const timestamp = new Date().getTime();
    //  
    const randomString = randomBytes(3).toString('hex');
    //  
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    //  
    const safeFileName = nameWithoutExt
      .replace(/[^\w\u4e00-\u9fa5]/g, '_') //  
      .slice(0, 50); //  
  
    return `${safeFileName}_${timestamp}_${randomString}`;
  }