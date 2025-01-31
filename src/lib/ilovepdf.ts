import jwt from 'jsonwebtoken';
import { generateUniqueFileName } from './managefilename';

export async function convertByilovePDF(file: File, email: string, convertType: string, compressLevel: 'low' | 'recommended' | 'extreme' = 'low', password: string = '') {
    // 
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const secretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!publicKey || !secretKey) {
        throw new Error('The API is misconfigured');
    }

    //  
    const authResponse = await fetch('https://api.ilovepdf.com/v1/auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            public_key: publicKey
        })
    });

    if (!authResponse.ok) {
        throw new Error('Failed to obtain the token');
    }

    const { token } = await authResponse.json();
    console.log('从服务器获取的Token:', token);

    //  
    let processEndpoint: string;
    let targetFormat: string;

    switch(convertType) {
        case 'pdftojpg':
            processEndpoint = 'pdfjpg';
            targetFormat = 'jpg';
            break;
        case 'encryptpdf':
            processEndpoint = 'protect';
            targetFormat = 'pdf';
            break;
        case 'unlockpdf':
            processEndpoint = 'unlock';
            targetFormat = 'pdf';
            
            break;
        case 'compresspdf':
            processEndpoint = 'compress';
            targetFormat = 'pdf';
            break;
        case 'doctopdf':
        case 'exceltopdf':
        case 'ppttopdf':
            processEndpoint = 'officepdf';
            targetFormat = 'pdf';
            break;
        case 'jpgtopdf':
            processEndpoint = 'imagepdf';  //  
            targetFormat = 'pdf';
            break;
        default:
            throw new Error('Unsupported conversion types');
    }

    console.log(`Start: ${processEndpoint}`);

    const startResponse = await fetch(`https://api.ilovepdf.com/v1/start/${processEndpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!startResponse.ok) {
        const errorText = await startResponse.text();
        console.error('Start Response Error:', errorText);
        throw new Error('The task failed to be created');
    }

    const startData = await startResponse.json();
    console.log('Start Response Data:', startData); //  

    if (!startData || !startData.server || !startData.task) {
        console.error('Start Data is incomplete:', startData);
        throw new Error('Failed to get server information');
    }

    const { server, task } = startData;
    console.log(`server: ${server}, Task ID: ${task}`);

    // 
    const uploadFormData = new FormData();
    uploadFormData.append('task', task);
    uploadFormData.append('file', file);

    console.log('uploading...');

    const uploadResponse = await fetch(`https://${server}/v1/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: uploadFormData
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload Response Error:', errorText);
        throw new Error('The file upload failed, please check the network');
    }

    const uploadData = await uploadResponse.json();
    console.log('Upload Response Data:', uploadData); //  

    const { server_filename } = uploadData;
    if (!server_filename) {
        console.error('Upload Data is incomplete:', uploadData);
        throw new Error('Failed to upload file: Missing server_filename');
    }

    //  
    const processData = {
        task,
        tool: processEndpoint,
        files: [{
            server_filename,  //  
            
            filename: file.name,  //  
            // 
        ...(convertType === 'unlockpdf' && {
            password: password  //  
        })
        }],
        ignore_errors: true,  //  
        try_pdf_repair: true,  //  
        try_image_repair: true,  //  
        //  
        ...(convertType === 'encryptpdf' && {
            password: password  //  
        }),
        
        //  
        ...(convertType === 'compresspdf' && {
            compression_level: compressLevel
        }),
        //  
        ...(convertType === 'jpgtopdf' && {
            orientation: 'portrait',  // 
            margin: 0,  //  
            pagesize: 'fit',  //  
            merge_after: true  //  
        })
    };

    console.log('处理数据:', processData);

    const processResponse = await fetch(`https://${server}/v1/process`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(processData)
    });

    if (!processResponse.ok) {
        const errorText = await processResponse.text();
        console.error('Process Response Error:', errorText);
        
        //  
        try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.param?.[0]?.error === 'WrongPassword') {
                console.log(password);
                console.log(convertType);
                throw new Error('password error');
            }
        } catch (e) {
            //    
        }
        
        throw new Error('Failed to process the file, please check the password or the file format is correct');
    }

    const processDataResponse = await processResponse.json();
    console.log('Process Response Data:', processDataResponse); //  

    //  
    if (processDataResponse.status && processDataResponse.status !== 'TaskSuccess') {
        console.log('The task failed:', processDataResponse);
        throw new Error(`The task failed: ${processDataResponse.status}`);
    }

    //  
    console.log('Start downloading...');

    const downloadResponse = await fetch(`https://${server}/v1/download/${task}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    if (!downloadResponse.ok) {
        const errorText = await downloadResponse.text();
        console.log('Download Response Error:', errorText);
        throw new Error('Failed to download the converted file');
    }

    const convertedFile = await downloadResponse.blob();
    const originalFileName = file.name.replace(/\.[^/.]+$/, "");
    const downloadFileName = `${originalFileName}.${targetFormat}`;


    console.log('success:', downloadFileName);

    return {
        file: convertedFile,
        fileName: downloadFileName
    };
} 