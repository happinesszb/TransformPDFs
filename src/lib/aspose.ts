import { generateUniqueFileName } from './managefilename';

export async function convertFromPDFByAspose(file: File, email: string, convertType: string) {
    // 
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('The API is misconfigured');
    }

    // 1. 
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
  
    // 
    const uniqueFileName = generateUniqueFileName(file.name);
    let outputFileName: string;
    let convertUrl: string;

    switch(convertType) {
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

    const outPath = `TransformPDF/${outputFileName}`;
    convertUrl = convertType === 'pdftodoc' ? 
      `${convertUrl}?format=DocX&outPath=${encodeURIComponent(outPath)}` :
      `${convertUrl}?outPath=${encodeURIComponent(outPath)}`;

    const convertFormData = new FormData();
    convertFormData.append('File', file);
  
    // 
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
  
    // 
    const downloadResponse = await fetch(`https://api.aspose.cloud/v3.0/pdf/storage/file/${encodeURIComponent(outPath)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: AbortSignal.timeout(10 * 60 * 1000)
    });
  
    if (!downloadResponse.ok) {
      throw new Error('Failed to download the converted file');
    }
  
    const convertedFile = await downloadResponse.blob();
    const fileExtension = outputFileName.split('.').pop() || 'doc';
    const downloadFileName = file.name.replace(/\.[^/.]+$/, "") + '.' + fileExtension;
  
   
  
    return {
      file: convertedFile,
      fileName: downloadFileName
    };
  }

  export async function convertToPDFByAspose(file: File, email: string, convertType: string) {
    
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('The API is misconfigured');
    }

    // 
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

    // 
    const uniqueFileName = generateUniqueFileName(file.name);
    const outputFileName = `${uniqueFileName}.pdf`;
    const outPath = `TransformPDF/${outputFileName}`;
    
    // 
    const convertUrl = `https://api.aspose.cloud/v4.0/words/convert?format=pdf&outPath=${encodeURIComponent(outPath)}`;
    
    const convertFormData = new FormData();
    convertFormData.append('File', file);

    // 
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

    // 
    const downloadResponse = await fetch(`https://api.aspose.cloud/v3.0/pdf/storage/file/${encodeURIComponent(outPath)}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    if (!downloadResponse.ok) {
        throw new Error('Failed to download the converted file');
    }

    const convertedFile = await downloadResponse.blob();
    const downloadFileName = file.name.replace(/\.[^/.]+$/, "") + '.pdf';

  

    return {
        file: convertedFile,
        fileName: downloadFileName
    };
}

export async function OCRPDFByAspose(file: File, email: string, languages: string[] = ['eng']) {
    // 
    const clientId = process.env.ASPOSE_CLIENT_ID;
    const clientSecret = process.env.ASPOSE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('The API is misconfigured');
    }

    // 
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
  
    // 
    let uniqueFileName = generateUniqueFileName(file.name);
    uniqueFileName += '.pdf';
    const storage = 'TransformPDF';
    
    // 
    const uploadUrl = `https://api.aspose.cloud/v3.0/pdf/storage/file/${encodeURIComponent(uniqueFileName)}`;
    const uploadFormData = new FormData();
    uploadFormData.append('File', file);
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      },
      body: uploadFormData,
      signal: AbortSignal.timeout(10 * 60 * 1000)
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to storage');
    }
    
    // 
    // 
    const languageParam = encodeURIComponent(languages.join(','));
    const ocrUrl = `https://api.aspose.cloud/v3.0/pdf/${encodeURIComponent(uniqueFileName)}/ocr?lang=${languageParam}`;
    
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
  
    // 
    const downloadResponse = await fetch(`https://api.aspose.cloud/v3.0/pdf/storage/file/${encodeURIComponent(uniqueFileName)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      signal: AbortSignal.timeout(10 * 60 * 1000)
    });
  
    if (!downloadResponse.ok) {
      throw new Error('Failed to download the OCR processed file');
    }
  
    const convertedFile = await downloadResponse.blob();
    const downloadFileName = file.name.replace(/\.pdf$/i, "_ocr.pdf");
  
   
  
    return {
      file: convertedFile,
      fileName: downloadFileName
    };
}