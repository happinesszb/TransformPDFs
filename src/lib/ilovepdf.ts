import jwt from 'jsonwebtoken';
import { generateUniqueFileName } from './managefilename';

export async function convertByilovePDF(file: File, email: string, convertType: string, compressLevel: 'low' | 'recommended' | 'extreme' = 'low', password: string = '') {
    // 检查环境变量
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const secretKey = process.env.ILOVEPDF_SECRET_KEY;

    if (!publicKey || !secretKey) {
        throw new Error('The API is misconfigured');
    }

    // 从认证服务器获取 Token
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

    // 1. 开始新任务
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
            processEndpoint = 'imagepdf';  // iLovePDF API 中的图片转PDF工具
            targetFormat = 'pdf';
            break;
        default:
            throw new Error('Unsupported conversion types');
    }

    console.log(`开始任务，工具: ${processEndpoint}`);

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
    console.log('Start Response Data:', startData); // 添加日志

    if (!startData || !startData.server || !startData.task) {
        console.error('Start Data is incomplete:', startData);
        throw new Error('Failed to get server information');
    }

    const { server, task } = startData;
    console.log(`服务器: ${server}, 任务ID: ${task}`);

    // 2. 上传文件
    const uploadFormData = new FormData();
    uploadFormData.append('task', task);
    uploadFormData.append('file', file);

    console.log('开始上传文件...');

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
    console.log('Upload Response Data:', uploadData); // 添加日志

    const { server_filename } = uploadData;
    if (!server_filename) {
        console.error('Upload Data is incomplete:', uploadData);
        throw new Error('Failed to upload file: Missing server_filename');
    }

    // 3. 执行转换
    const processData = {
        task,
        tool: processEndpoint,
        files: [{
            server_filename,  // 服务器端的文件名
            
            filename: file.name,  // 原始文件名
            // PDF解密的特定参数
        ...(convertType === 'unlockpdf' && {
            password: password  // 提供解密密码
        })
        }],
        ignore_errors: true,  // 添加此参数以尝试处理损坏的文件
        try_pdf_repair: true,  // 尝试修复PDF文件
        try_image_repair: true,  // 尝试修复图片文件
        // PDF加密的特定参数
        ...(convertType === 'encryptpdf' && {
            password: password  // 设置加密密码
        }),
        
        // PDF压缩的特定参数
        ...(convertType === 'compresspdf' && {
            compression_level: compressLevel
        }),
        // 图片转PDF的特定参数
        ...(convertType === 'jpgtopdf' && {
            orientation: 'portrait',  // 或 'landscape'
            margin: 0,  // 页边距
            pagesize: 'fit',  // 页面大小适应图片
            merge_after: true  // 如果有多个图片，合并为一个PDF
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
        
        // 添加对密码错误的特殊处理
        try {
            const errorData = JSON.parse(errorText);
            if (errorData.error?.param?.[0]?.error === 'WrongPassword') {
                console.log(password);
                console.log(convertType);
                throw new Error('password error');
            }
        } catch (e) {
            // JSON 解析失败，使用通用错误信息
        }
        
        throw new Error('Failed to process the file, please check the password or the file format is correct');
    }

    const processDataResponse = await processResponse.json();
    console.log('Process Response Data:', processDataResponse); // 添加日志

    // 检查任务状态
    if (processDataResponse.status && processDataResponse.status !== 'TaskSuccess') {
        console.log('The task failed:', processDataResponse);
        throw new Error(`The task failed: ${processDataResponse.status}`);
    }

    // 4. 下载转换后的文件
    console.log('开始下载转换后的文件...');

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


    console.log('转换成功:', downloadFileName);

    return {
        file: convertedFile,
        fileName: downloadFileName
    };
} 