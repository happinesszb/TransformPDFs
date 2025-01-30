// 生成唯一文件名的函数
import { randomBytes } from 'crypto';
export function generateUniqueFileName(originalName: string): string {
    // 获取当前时间戳
    const timestamp = new Date().getTime();
    // 生成6位随机字符串
    const randomString = randomBytes(3).toString('hex');
    // 获取原始文件名（不含扩展名）和扩展名
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "");
    // 对原始文件名进行处理：移除特殊字符，将中文和其他非英文字符转为拼音或保留
    const safeFileName = nameWithoutExt
      .replace(/[^\w\u4e00-\u9fa5]/g, '_') // 将特殊字符替换为下划线
      .slice(0, 50); // 限制文件名长度
  
    return `${safeFileName}_${timestamp}_${randomString}`;
  }