'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useLocale } from '@/hooks/useLocale';

interface FileRemoteUploaderProps {
  onUploadSuccess: (fileUrl: string) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileRemoteUploader({ 
  onUploadSuccess, 
  multiple = false, 
  maxFiles = 1 
}: FileRemoteUploaderProps) {
  const { t } = useLocale();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple,
    maxFiles,
    onDrop: async (files) => {
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', files[0]);

        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          const fileUrl = response.data.fileUrl.startsWith('http') 
            ? response.data.fileUrl 
            : `${window.location.origin}${response.data.fileUrl}`;
            
          onUploadSuccess(fileUrl);
        } else {
          setError('上传失败，请重试。');
        }
      } catch (uploadError) {
        console.error('上传出错:', uploadError);
        setError('上传出错，请检查网络或文件格式。');
      } finally {
        setUploading(false);
      }
    }
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`bg-white p-8 rounded-lg border-2 border-dashed 
          ${isDragActive ? 'border-purple-600 bg-purple-50' : 'border-purple-400'}
          hover:border-purple-600 transition-colors cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? t.tools.fileUploader.dropToUpload : t.tools.fileUploader.dragOrClick}
          </p>
          <p className="text-sm text-gray-500">
            {multiple 
              ? t.tools.fileUploader.multipleFiles.replace('${maxFiles}', maxFiles.toString())
              : t.tools.fileUploader.singleFile}
          </p>
          {uploading && <p className="text-sm text-gray-500">上传中...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
} 