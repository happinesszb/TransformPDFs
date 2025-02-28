import { generateUniqueFileName } from './managefilename';
import AWS from 'aws-sdk';

export async function convertFromPDFByAspose(file: File, email: string, convertType: string) {
    // 检查环境变量
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('The API is misconfigured');
    }

    // 1. 获取访问令牌
    const tokenResponse = await fetch('https://api.aspose.cloud/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret
      }),
      signal: AbortSignal.timeout(15 * 60 * 1000)
    });
  
    if (!tokenResponse.ok) {
      throw new Error(`Failed to obtain an access token`);
    }
  
    const { access_token: accessToken } = await tokenResponse.json();
  
    // 2. 准备转换
    const uniqueFileName = generateUniqueFileName(file.name);
    let outputFileName: string;
    let convertUrl: string;

    switch(convertType) {
      case 'pdftohtml':
        outputFileName = `${uniqueFileName}.zip`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/html`;
          break;

      case 'pdftoepub':
        outputFileName = `${uniqueFileName}.epub`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/epub`;
          break;

      case 'pdftotiff':
        outputFileName = `${uniqueFileName}.tiff`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/tiff`;
          break;

      case 'pdftotex':
        outputFileName = `${uniqueFileName}.tex`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/tex`;
        break;

      case 'pdftosvg':
        outputFileName = `${uniqueFileName}.svg`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/svg`;
        break;

      case 'pdftomobi':
        outputFileName = `${uniqueFileName}.mobi`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/mobixml?`;
        break;
        
      case 'pdftoxps':
        outputFileName = `${uniqueFileName}.xps`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/xps`;
        break;

      case 'pdftoxml':
        outputFileName = `${uniqueFileName}.xml`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/xml`;
        break;

      case 'pdftoppt':
        outputFileName = `${uniqueFileName}.pptx`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/pptx`;
        break;
        
      case 'pdftoexcel':
        outputFileName = `${uniqueFileName}.xls`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/xls`;
        break;
        
      case 'pdftodoc':
      default:
        outputFileName = `${uniqueFileName}.docx`;
        convertUrl = `https://api.aspose.cloud/v3.0/pdf/convert/doc`;
        break;
    }

    const outPath = `${outputFileName}`;
    convertUrl = convertType === 'pdftodoc' ? 
      `${convertUrl}?format=DocX&outPath=${encodeURIComponent(outPath)}&storage=transformpdfs` :
      `${convertUrl}?outPath=${encodeURIComponent(outPath)}&storage=transformpdfs`;

    const convertFormData = new FormData();
    convertFormData.append('File', file);
  
    // 3. 执行转换
    const convertResponse = await fetch(convertUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      body: convertFormData,
      signal: AbortSignal.timeout(20 * 60 * 1000)
    });
  
    if (!convertResponse.ok) {
      const convertError = await convertResponse.text();
      try {
        const errorJson = JSON.parse(convertError);
        throw new Error(`Failed to convert the file: ${JSON.stringify(errorJson)}`);
      } catch {
        throw new Error(`Failed to convert the file: Status code ${convertResponse.status}, ${convertError}`);
      }
    }
  
    // 4. 从 S3 下载转换后的文件
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const bucketName = 'transformpdfs';
    const s3Key = `${outputFileName}`;

    try {
        console.log(`Downloading file from S3: ${s3Key}`);
        const downloadParams = {
            Bucket: bucketName,
            Key: s3Key
        };

        const s3Object = await s3.getObject(downloadParams).promise();
        const convertedFile = s3Object.Body as Buffer;

        const fileExtension = outputFileName.split('.').pop() || 'doc';
        const downloadFileName = file.name.replace(/\.[^/.]+$/, "") + '.' + fileExtension;


        return {
            file: new Blob([convertedFile]),
            fileName: downloadFileName
        };
    } catch (error) {
        console.error('Download file from S3 error:', error);
        throw new Error('Failed to download the converted file from S3');
    }
}

export async function convertDocToPDFByAspose(file: File, email: string, convertType: string) {
    // 检查环境变量
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('The API is misconfigured');
    }

    // 1. 获取访问令牌
    const tokenResponse = await fetch('https://api.aspose.cloud/connect/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': clientId,
            'client_secret': clientSecret
        })
    });

    if (!tokenResponse.ok) {
        throw new Error(`Failed to obtain an access token`);
    }

    const { access_token: accessToken } = await tokenResponse.json();

    // 2. 准备转换
    const uniqueFileName = generateUniqueFileName(file.name);
    const outputFileName = `${uniqueFileName}.pdf`;
    const outPath = `${outputFileName}`;
    
    // 使用 Words API 进行转换
    const convertUrl = `https://api.aspose.cloud/v4.0/words/convert?format=pdf&outPath=${encodeURIComponent(outPath)}&storage=transformpdfs`;
    
    const convertFormData = new FormData();
    convertFormData.append('File', file);

    // 3. 执行转换
    const convertResponse = await fetch(convertUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json'
        },
        body: convertFormData
    });

    if (!convertResponse.ok) {
        const convertError = await convertResponse.text();
        try {
            const errorJson = JSON.parse(convertError);
            throw new Error(`Failed to convert the file: ${JSON.stringify(errorJson)}`);
        } catch {
            throw new Error(`Failed to convert the file: Status code ${convertResponse.status}, ${convertError}`);
        }
    }

    // 4. 从 S3 下载转换后的文件
  const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
  });

  const bucketName = 'transformpdfs';
  const s3Key = `${outputFileName}`;

  try {
      console.log(`Downloading file from S3: ${s3Key}`);
      const downloadParams = {
          Bucket: bucketName,
          Key: s3Key
      };

      const s3Object = await s3.getObject(downloadParams).promise();
      const convertedFile = s3Object.Body as Buffer;

      const downloadFileName = file.name.replace(/\.[^/.]+$/, "") + '.pdf';


      return {
          file: new Blob([convertedFile]),
          fileName: downloadFileName
      };
  } catch (error) {
      console.error('Download file from S3 error:', error);
      throw new Error('Failed to download the converted file from S3');
  }
}

export async function OCRPDFByAspose(file: File, email: string, languages: string[] = ['eng']) {
    // 检查环境变量
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('The API is misconfigured');
    }

    // 1. 获取访问令牌
    const tokenResponse = await fetch('https://api.aspose.cloud/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'client_id': clientId,
        'client_secret': clientSecret
      }),
      signal: AbortSignal.timeout(5 * 60 * 1000)
    });
  
    if (!tokenResponse.ok) {
      throw new Error(`Failed to obtain an access token`);
    }
  
    const { access_token: accessToken } = await tokenResponse.json();
  
    // 2. 上传文件到 S3
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    const bucketName = 'transformpdfs';
    const uniqueFileName = generateUniqueFileName(file.name) + '.pdf';
    const s3Key = `${uniqueFileName}`;

    // 将 Blob 转换为 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传文件到S3
    const uploadParams = {
        Bucket: bucketName,
        Key: s3Key,
        Body: buffer
    };

    try {
        console.log(`Uploading file to S3: ${s3Key}`);
        await s3.upload(uploadParams).promise();
        console.log('File uploaded to S3 successfully');
    } catch (error) {
        console.error('Upload file to S3 error:', error);
        throw new Error('Failed to upload file to S3');
    }

    // 3. 执行OCR转换
    const languageParam = encodeURIComponent(languages.join(','));
    const ocrUrl = `https://api.aspose.cloud/v3.0/pdf/${encodeURIComponent(uniqueFileName)}/ocr?lang=${languageParam}&storage=transformpdfs`;
    
    const convertResponse = await fetch(ocrUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'x-aspose-client': 'Containerize.Swagger'
      },
      signal: AbortSignal.timeout(20 * 60 * 1000)
    });
  
    if (!convertResponse.ok) {
      const convertError = await convertResponse.text();
      try {
        const errorJson = JSON.parse(convertError);
        throw new Error(`Failed to OCR the file: ${JSON.stringify(errorJson)}`);
      } catch {
        throw new Error(`Failed to OCR the file: Status code ${convertResponse.status}, ${convertError}`);
      }
    }
    console.log('Start to download OCR file');
    // 4. 下载处理后的文件
    try {
        console.log(`Downloading file from S3: ${s3Key}`);
        const downloadParams = {
            Bucket: bucketName,
            Key: s3Key
        };

        const s3Object = await s3.getObject(downloadParams).promise();
        const convertedFile = s3Object.Body as Buffer;

        const downloadFileName = file.name.replace(/\.pdf$/i, "_ocr.pdf");


        return {
            file: new Blob([convertedFile]),
            fileName: downloadFileName
        };
    } catch (error) {
        console.error('Download file from S3 error:', error);
        throw new Error('Failed to download the OCR processed file from S3');
    }
}

export async function convertToPDFByAspose(file: File, email: string, convertType: string) {
  // Check environment variables
  const clientId = process.env.ASPOSE_CLIENT_ID;
  const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('The API is misconfigured');
  }

  // 1. Get access token
  const tokenResponse = await fetch('https://api.aspose.cloud/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: new URLSearchParams({
      'grant_type': 'client_credentials',
      'client_id': clientId,
      'client_secret': clientSecret
    }),
    signal: AbortSignal.timeout(15 * 60 * 1000)
  });

  if (!tokenResponse.ok) {
    throw new Error(`Failed to obtain an access token`);
  }

  const { access_token: accessToken } = await tokenResponse.json();

  // 2. 准备转换
  const uniqueFileName = generateUniqueFileName(file.name);
  let storagePath;
  let convertUrl;
  
  // 定义文件类型到API路径的映射
  const conversionMap = {
    'epubtopdf': {
      extension: '.epub',
      endpoint: 'epub'
    },
    'htmltopdf': {
      extension: '.mht',
      endpoint: 'mht'
    },
    'textopdf': {
      extension: '.tex',
      endpoint: 'tex'
    },
    'pstopdf': {
      extension: '.ps',
      endpoint: 'ps'
    },
    'xslfotopdf': {
      extension: '.xslfo',
      endpoint: 'xslfo'
    },
    'xpstopdf': {
      extension: '.xps',
      endpoint: 'xps'
    },
    'svgtopdf': {
      extension: '.svg',
      endpoint: 'svg'
    },
    'pcltopdf': {
      extension: '.pcl',
      endpoint: 'pcl'
    },
    'xmltopdf': {
      extension: '.xml',
      endpoint: 'xml'
    },
    'mdtopdf': {
      extension: '.md',
      endpoint: 'markdown'
    }
  };

  if (!(convertType in conversionMap)) {
    throw new Error(`Unsupported conversion type: ${convertType}`);
  }

  const { extension, endpoint } = conversionMap[convertType as keyof typeof conversionMap];
  const sourceFileName = `${uniqueFileName}${extension}`;
  storagePath = `${sourceFileName}`;
  convertUrl = `https://api.aspose.cloud/v3.0/pdf/create/${endpoint}?storage=transformpdfs&srcPath=${encodeURIComponent(storagePath)}`;

  // 配置AWS S3
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  const bucketName = 'transformpdfs';
  const s3Key = `${sourceFileName}`;

  // 将 Blob 转换为 Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 上传文件到S3
  const uploadParams = {
    Bucket: bucketName,
    Key: s3Key,
    Body: buffer
  };

  try {
    console.log(`Uploading file to S3: ${s3Key}`);
    await s3.upload(uploadParams).promise();
    console.log('File uploaded to S3 successfully');
  } catch (error) {
    console.error('Upload file to S3 error:', error);
    throw new Error('Failed to upload file to S3');
  }

  // 3. 执行转换
  console.log(`Execute conversion request to: ${convertUrl}`);
  
  try {
    const convertResponse = await fetch(convertUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(20 * 60 * 1000)
    });

    if (!convertResponse.ok) {
      const convertError = await convertResponse.text();
      console.error('Convert file error details:', convertError);
      try {
        const errorJson = JSON.parse(convertError);
        throw new Error(`Failed to convert the file: ${JSON.stringify(errorJson)}`);
      } catch {
        throw new Error(`Failed to convert the file: Status code ${convertResponse.status}, Error: ${convertError}`);
      }
    }
    
    console.log('Convert file successfully, start to download');

    // 4. 获取转换后的PDF文件
    const convertedFile = await convertResponse.blob();
    const downloadFileName = file.name.replace(/\.[^/.]+$/, "") + '.pdf';


    return {
      file: convertedFile,
      fileName: downloadFileName
    };
  } catch (error) {
    console.error('converting file error:', error);
    throw error;
  }
}