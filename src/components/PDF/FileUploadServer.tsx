'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocale } from '@/hooks/useLocale';

import { ConvertType } from '@/types/convert';

interface FileUploadServerProps {
  onFileSelect: (file: File) => void;
  convertType: ConvertType;
}

export default function FileUploadServer({ onFileSelect, convertType }: FileUploadServerProps) {
  const { t } = useLocale();
  
  // 根据转换类型获取允许的文件类型
  const getAcceptedFileTypes = (type: ConvertType) => {
    switch (type) {
      case 'pdftodoc':
      case 'pdftoexcel':
      case 'pdftoppt':
      case 'pdftojpg':
      case 'ocrpdf':
      case 'compresspdf':
      case 'encryptpdf':
      case 'unlockpdf':
      case 'pdftoepub':
      case 'pdftohtml':
      case 'pdftotiff':
      case 'pdftotex':
      case 'pdftosvg':
      case 'pdftomobi':
      case 'pdftoxps':
      case 'pdftoxml':
        return {
          'application/pdf': ['.pdf']
        };
      case 'doctopdf':
        return {
          'application/msword': ['.doc'],
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        };
      case 'exceltopdf':
        return {
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
        };
      case 'ppttopdf':
        return {
          'application/vnd.ms-powerpoint': ['.ppt'],
          'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        };
      case 'jpgtopdf':
        return {
          'image/jpeg': ['.jpg', '.jpeg'],
          'image/png': ['.png']
        };
      default:
        return {};
    }
  };

  // 获取支持的文件类型提示文本
  const getSupportedFileText = (type: ConvertType) => {
    switch (type) {
      case 'pdftodoc':
      case 'pdftoexcel':
      case 'pdftoppt':
      case 'pdftojpg':
      case 'ocrpdf':
      case 'compresspdf':
        return 'PDF (.pdf)';
      case 'doctopdf':
        return 'Word  (.doc, .docx)';
      case 'exceltopdf':
        return 'Excel (.xls, .xlsx)';
      case 'ppttopdf':
        return 'PowerPoint (.ppt, .pptx)';
      case 'jpgtopdf':
        return 'Image (.jpg, .jpeg, .png)';
      default:
        return '';
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: getAcceptedFileTypes(convertType),
    multiple: false,
    maxFiles: 1,
    onDrop: files => {
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    }
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`bg-white p-8 rounded-lg border-2 border-dashed 
          ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-blue-400'}
          hover:border-blue-600 transition-colors cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {isDragActive ? t.fileUpload.dropToUpload : t.fileUpload.dragOrClick}
          </p>
          <p className="text-sm text-gray-500">
            {getSupportedFileText(convertType)}
          </p>
        </div>
      </div>
    </div>
  );
} 