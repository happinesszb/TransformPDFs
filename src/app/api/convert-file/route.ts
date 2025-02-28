import { NextRequest, NextResponse } from 'next/server';
import { convertFromPDFByAspose, convertDocToPDFByAspose, OCRPDFByAspose, convertToPDFByAspose } from '@/lib/aspose';
import { convertByilovePDF } from '@/lib/ilovepdf';
import { getCurrentLocale } from "@/utils/i18n";
import { updateTaskStatus, setTaskFile } from '@/lib/taskStatus';

export async function POST(request: NextRequest) {
  try {
    // 从 Accept-Language 获取用户语言偏好
    const acceptLanguage = request.headers.get('Accept-Language') || 'en';
    // 获取第一个语言代码，例如 'zh-CN,zh;q=0.9' 会得到 'zh'
    const userLang = acceptLanguage.split(',')[0].split('-')[0];
    
    // 支持的语言列表
    const supportedLangs = ['en', 'zh', 'ar', 'fr', 'es', 'pt'];
    // 如果用户语言不在支持列表中，使用默认语言 'en'
    const lang = supportedLangs.includes(userLang) ? userLang : 'en';
    const locale = await getCurrentLocale({ lang });

    const formData = await request.formData();
    const file = formData.get('File') as File;
    const email = formData.get('email') as string;
    const token = formData.get('token') as string;
    const convertType = formData.get('convertType') as string;

    // 获取压缩级别参数
    const compressLevel = (formData.get('compressLevel') as string || 'low') as 'low' | 'recommended' | 'extreme';
    
    // 获取OCR语言参数
    let languages: string[] = ['eng'];
    if (convertType === 'ocrpdf') {
      const languagesStr = formData.get('languages');
      if (languagesStr) {
        languages = JSON.parse(languagesStr as string);
      }
    }

    // 获取密码参数
    const password = formData.get('password') as string || '';

    if (!file || !email || !token || !convertType) {
      return NextResponse.json({ error: 'Necessary parameters are missing' }, { status: 400 });
    }


    // 生成任务ID
    const taskId = crypto.randomUUID();
    
    // 立即返回任务ID
    updateTaskStatus(taskId, { status: 'pending' });
    
    // 异步执行转换
    (async () => {
      try {
        updateTaskStatus(taskId, { status: 'processing' });

        let convertedFile: Blob, fileName: string;
        if (convertType === 'doctopdf') {
          ({ file: convertedFile, fileName } = await convertDocToPDFByAspose(file, email, convertType));
        } else if ([
          'pdftodoc', 'pdftoexcel', 'pdftoppt', 'pdftohtml', 'pdftoepub',
          'pdftotiff', 'pdftotex', 'pdftosvg', 'pdftomobi', 'pdftoxps', 'pdftoxml'
        ].includes(convertType)) {
          ({ file: convertedFile, fileName } = await convertFromPDFByAspose(file, email, convertType));
        } else if (convertType === 'ocrpdf') {
          ({ file: convertedFile, fileName } = await OCRPDFByAspose(file, email, languages));
        } else if ([
          'epubtopdf', 'htmltopdf', 'textopdf', 'pstopdf', 'xslfotopdf',
          'xpstopdf', 'svgtopdf', 'pcltopdf', 'xmltopdf', 'mdtopdf'
        ].includes(convertType)) {
          ({ file: convertedFile, fileName } = await convertToPDFByAspose(file, email, convertType));
        } else if (convertType === 'encryptpdf' || convertType === 'unlockpdf') {
          ({ file: convertedFile, fileName } = await convertByilovePDF(file, email, convertType, compressLevel, password));
        } else {
          ({ file: convertedFile, fileName } = await convertByilovePDF(file, email, convertType, compressLevel));
        }

        // 获取文件扩展名和对应的Content-Type
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'pdf';
        const contentTypeMap: { [key: string]: string } = {
          'doc': 'application/msword',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'xls': 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'ppt': 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'pdf': 'application/pdf',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg'
        };
        const contentType = contentTypeMap[fileExtension] || 'application/octet-stream';

        // 存储转换结果的元数据和文件
        updateTaskStatus(taskId, { 
          status: 'completed',
          result: { 
            fileName,
            contentType 
          }
        });
        setTaskFile(taskId, convertedFile);
      } catch (error) {
        updateTaskStatus(taskId, { 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    })();

    return NextResponse.json({ taskId });
    
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'File conversion failed'
    }, { status: 500 });
  }
} 

export const config = {
  api: {
    bodyParser: {
      bodyParser: false,
    },
    responseLimit: false,
  },
} 