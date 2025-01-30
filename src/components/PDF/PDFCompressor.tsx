'use client';

import { useState } from 'react';
import { PDFDocument, PDFName, PDFDict, PDFStream } from 'pdf-lib';
import FileUploader from './FileUploader';
import imageCompression from 'browser-image-compression';
import { useLocale } from '@/hooks/useLocale';

type CompressionLevel = 'medium' | 'high';

interface CompressionOptions {
  imageQuality: number;
  maxImageDimension: number;
}

const compressionLevels: Record<CompressionLevel, CompressionOptions> = {
  medium: { imageQuality: 0.3, maxImageDimension: 800 },
  high: { imageQuality: 0.08, maxImageDimension: 400 }
};

export default function PDFCompressor() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<HTMLCanvasElement | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [progress, setProgress] = useState<number>(0);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    try {
      setLoading(true);
      setOriginalSize(files[0].size);
      
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { 
        ignoreEncryption: true 
      });
      setPdfDoc(pdfDoc);
      
      await generateThumbnail(files[0]);
    } catch (error) {
      console.error('There was an error loading the PDF file:', error);
      alert('The file is encrypted or corrupted');
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnail = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
      }
      
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 0.3 });

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context!,
        viewport: viewport
      }).promise;

      setThumbnail(canvas);
    } catch (error) {
      console.error('生成缩略图时出错:', error);
    }
  };

  const compressImage = async (imageData: Uint8Array, options: CompressionOptions): Promise<Uint8Array> => {
    const blob = new Blob([imageData]);
    
    try {
      const compressedFile = await imageCompression(new File([blob], "image.jpg", {
        type: 'image/jpeg'
      }), {
        maxSizeMB: options.imageQuality === 0.08 ? 0.1 : 0.3,
        maxWidthOrHeight: options.maxImageDimension,
        useWebWorker: true,
        initialQuality: options.imageQuality,
        fileType: 'image/jpeg',
        alwaysKeepResolution: false,
        maxIteration: 30,
        exifOrientation: 1,
        mozJPEG: true
      });

      return new Uint8Array(await compressedFile.arrayBuffer());
    } catch (error) {
      console.error('Image compression failed:', error);
      return imageData;
    }
  };

  const handleCompress = async () => {
    if (!pdfDoc) return;
    
    try {
      setLoading(true);
      setProgress(0);
      
      const pages = pdfDoc.getPages();
      const newPdfDoc = await PDFDocument.create();
      const options = compressionLevels[compressionLevel];
      
      for (let i = 0; i < pages.length; i++) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        
        const resources = copiedPage.node.Resources();
        if (!resources) {
          console.log('The page does not have a resource dictionary, skipping processing');
          newPdfDoc.addPage(copiedPage);
          setProgress(((i + 1) / pages.length) * 100);
          continue;
        }

        let images;
        try {
          images = resources.lookup(PDFName.of('XObject'), PDFDict);
        } catch (error) {
          console.log('Failed to get XObject, skipping processing');
          newPdfDoc.addPage(copiedPage);
          setProgress(((i + 1) / pages.length) * 100);
          continue;
        }
        
        if (images) {
          const xObjects = images.dict;
          if (xObjects) {
            for (const [_name, xObject] of Object.entries(xObjects)) {
              if (xObject instanceof PDFStream) {
                try {
                  const imageData = xObject.getContents();
                  if (imageData && imageData.length > 10000) {
                    try {
                      const compressedImageData = await compressImage(imageData, options);
                      if (compressedImageData.length < imageData.length) {
                        xObject.setContent(compressedImageData);
                      }
                    } catch (error) {
                      console.error('An error occurred while compressing a single picture, continuing to work on other pictures:', error);
                    }
                  }
                } catch (error) {
                  console.error('An error occurred while retrieving the content of the image, and the other images were processed:', error);
                }
              }
            }
          }
        }
        
        newPdfDoc.addPage(copiedPage);
        setProgress(((i + 1) / pages.length) * 100);
      }

      const compressedBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        preserveExistingEncryption: true,
        objectsPerTick: 50,
        updateFieldAppearances: false,
        compress: true
      });

      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      const compressedSize = blob.size;
      
      if (compressedSize >= originalSize) {
        alert('This PDF file cannot be further compressed, probably because:\n1. The file has been compressed\n2. The file mainly contains text.');
        return;
      }

      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      alert(`${t.tools.compressPdf.compressionComplete}
${t.tools.compressPdf.originalSize}: ${(originalSize / 1024 / 1024).toFixed(2)} MB
${t.tools.compressPdf.compressedSize}: ${(compressedSize / 1024 / 1024).toFixed(2)} MB
${t.tools.compressPdf.compressionRatio}: ${compressionRatio}%`);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed.pdf';
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('An error occurred while compressing the PDF:', error);
      alert('If there is an error during the compression process, try a different PDF file or reduce the compression quality');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div>The PDF file is being processed...</div>
        {progress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 overflow-auto">
        {!pdfDoc ? (
          <FileUploader 
            onFileSelect={handleFileSelect}
            multiple={false}
            maxFiles={1}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {thumbnail && (
              <div className="flex justify-center mb-4">
                <canvas
                  width={thumbnail.width}
                  height={thumbnail.height}
                  className="max-w-full h-auto"
                  ref={(canvasRef) => {
                    if (canvasRef) {
                      const ctx = canvasRef.getContext('2d');
                      ctx?.drawImage(thumbnail, 0, 0);
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg sticky top-4">
          <h3 className="font-medium">{t.tools.compressPdf.compressionOptions}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t.tools.compressPdf.originalSize}: {(originalSize / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white sticky top-48">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.tools.compressPdf.compressionQuality}
            </label>
            <select
              value={compressionLevel}
              onChange={(e) => setCompressionLevel(e.target.value as CompressionLevel)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="medium">{t.tools.compressPdf.mediumCompression}</option>
              <option value="high">{t.tools.compressPdf.highCompression}</option>
            </select>
          </div>

          <button
            onClick={handleCompress}
            disabled={!pdfDoc}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.compressPdf.compressButton}
          </button>
        </div>
      </div>
    </div>
  );
} 