'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocale } from '@/hooks/useLocale';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  multiple?: boolean;
  maxFiles?: number;
}

export default function FileUploader({ 
  onFileSelect, 
  multiple = false, 
  maxFiles = 1 
}: FileUploaderProps) {
  const { t } = useLocale();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple,
    maxFiles,
    onDrop: files => onFileSelect(files)
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
        </div>
      </div>
    </div>
  );
} 