'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploadServer from './FileUploadServer';
import { useLocale } from '@/hooks/useLocale';
import Select from 'react-select';

import { ConvertType } from '@/types/convert';

// Define conversion status types
type ConversionStatus = 'idle' | 'uploading' | 'converting' | 'downloading' | 'error';

// Add compression level type
type CompressionLevel = 'recommended' | 'extreme';

interface ConvertPDFProps {
  convertType: ConvertType;
}

// Add language options constant
const OCR_LANGUAGE_OPTIONS = [
  { value: 'eng', label: 'English' },
  { value: 'ara', label: 'Arabic' },
  { value: 'bel', label: 'Belarusian' },
  { value: 'ben', label: 'Bengali' },
  { value: 'bul', label: 'Bulgarian' },
  { value: 'ces', label: 'Czech' },
  { value: 'dan', label: 'Danish' },
  { value: 'deu', label: 'German' },
  { value: 'ell', label: 'Greek' },
  { value: 'fin', label: 'Finnish' },
  { value: 'fra', label: 'French' },
  { value: 'heb', label: 'Hebrew' },
  { value: 'hin', label: 'Hindi' },
  { value: 'ind', label: 'Indonesian' },
  { value: 'isl', label: 'Icelandic' },
  { value: 'ita', label: 'Italian' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'kor', label: 'Korean' },
  { value: 'nld', label: 'Dutch' },
  { value: 'nor', label: 'Norwegian' },
  { value: 'pol', label: 'Polish' },
  { value: 'por', label: 'Portuguese' },
  { value: 'ron', label: 'Romanian' },
  { value: 'rus', label: 'Russian' },
  { value: 'spa', label: 'Spanish' },
  { value: 'swe', label: 'Swedish' },
  { value: 'tha', label: 'Thai' },
  { value: 'tur', label: 'Turkish' },
  { value: 'ukr', label: 'Ukrainian' },
  { value: 'vie', label: 'Vietnamese' },
  { value: 'chi_sim', label: 'Chinese Simplified' },
  { value: 'chi_tra', label: 'Chinese Traditional' },
];

export default function ConvertPDF({ convertType }: ConvertPDFProps) {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ConversionStatus>('idle');
  const [thumbnailCanvas, setThumbnailCanvas] = useState<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<'fileSize' | 'dailyLimit' | 'monthlyLimit' | 'expired'>('fileSize');
  const { t } = useLocale();
  const [selectedLanguages, setSelectedLanguages] = useState([{ value: 'eng', label: 'English' }]);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('recommended');

  // Get file extension
  const getTargetExtension = (type: ConvertType): string => {
    const extensionMap: Record<ConvertType, string> = {
      pdftodoc: '.docx',
      pdftoexcel: '.xlsx',
      pdftoppt: '.pptx',
      pdftojpg: '.jpg',
      doctopdf: '.pdf',
      exceltopdf: '.pdf',
      ppttopdf: '.pdf',
      jpgtopdf: '.pdf',
      ocrpdf: '.pdf',
      compresspdf: '.pdf',
      pdftohtml: '.zip',
      pdftoepub: '.epub',
      epubtopdf: '.pdf',
      textopdf: '.pdf',
      pstopdf: '.pdf',
      xslfotopdf: '.pdf',
      xpstopdf: '.pdf',
      svgtopdf: '.pdf',
      pcltopdf: '.pdf',
      xmltopdf: '.pdf',
      mdtopdf: '.pdf',
      htmltopdf: '.pdf',
      pdftotiff: '.tiff',
      pdftotex: '.tex',
      pdftosvg: '.svg',
      pdftomobi: '.mobi',
      pdftoxps: '.xps',
      pdftoxml: '.xml'
    };
    return extensionMap[type];
  };

  const handleFileSelect = async (file: File) => {
    

    // Check file type
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const allowedExtensions = {
      jpgtopdf: ['jpg', 'jpeg', 'png'],
      epubtopdf: ['epub'],
      textopdf: ['tex'],
      pstopdf: ['ps'],
      xslfotopdf: ['fo', 'xslfo'],
      xpstopdf: ['xps'],
      svgtopdf: ['svg'],
      pcltopdf: ['pcl'],
      xmltopdf: ['xml'],
      mdtopdf: ['md', 'markdown'],
      htmltopdf: [ 'mht', 'mhtml']
    };

    const convertTypeMap: { [key: string]: string[] } = allowedExtensions;
    if (convertType in convertTypeMap && 
        !convertTypeMap[convertType].includes(fileExtension || '')) {
      alert(`Please select a valid ${convertType.replace('topdf', '').toUpperCase()} file`);
      return;
    }

    setPdfFile(file);
    await generateThumbnail(file);
  };

  const generateThumbnail = async (file: File) => {
    try {
      // Check if it's a document conversion
      const isDocumentConversion = ['doctopdf', 'exceltopdf', 'ppttopdf'].includes(convertType);
      
      if (isDocumentConversion) {
        // Create a simple canvas for document conversion and draw a generic icon
        const canvas = document.createElement('canvas');
        canvas.width = 200;  // Set appropriate width
        canvas.height = 200; // Set appropriate height
        
        const context = canvas.getContext('2d');
        if (context) {
          // Create an Image object to load the generic document icon
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            // Load different icons based on different conversion types
            const iconPath = convertType === 'doctopdf' 
              ? '/images/office/doc.png'
              : convertType === 'exceltopdf'
                ? '/images/office/excel.png'
                : '/images/office/ppt.png';
            img.src = iconPath;
          });
          
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          setThumbnailCanvas(canvas);
        }
      } else if (convertType === 'jpgtopdf') {
        // If it's an image file, create a thumbnail directly
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const img = new Image();
        
        // Create a Promise to handle image loading
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });

        // Set thumbnail size (maintain aspect ratio)
        const scale = Math.min(300 / img.width, 300 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        context?.drawImage(img, 0, 0, canvas.width, canvas.height);
        setThumbnailCanvas(canvas);
        URL.revokeObjectURL(img.src);
      } else {
        // Original PDF thumbnail generation logic
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

        setThumbnailCanvas(canvas);
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  const handleConvert = async () => {
    console.log('Starting conversion');
    if (!pdfFile) return;
    
    try {
      

      setStatus('uploading');
      setProgress(0);
      
      // Prepare FormData
      const formData = new FormData();
      formData.append('File', pdfFile);
      formData.append('convertType', convertType);
      
      if (convertType === 'compresspdf') {
        formData.append('compressLevel', compressionLevel);
      }
      
      if (convertType === 'ocrpdf') {
        formData.append('languages', JSON.stringify(selectedLanguages.map(lang => lang.value)));
      }

      console.log('Sending conversion request');
      // Send conversion request to get task ID
      const response = await fetch('/api/convert-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Conversion request failed:', errorData);
        throw new Error(errorData.error || 'File conversion failed');
      }

      const { taskId } = await response.json();
      console.log(`Received task ID: ${taskId}`);
      setStatus('converting');
      setProgress(30);

      // Start polling task status
      const pollStatus = async () => {
        try {
          console.log(`Polling task status - TaskID: ${taskId}`);
          const statusResponse = await fetch(`/api/convert-status?taskId=${taskId}`);
          if (!statusResponse.ok) {
            console.error('Status polling request failed');
            throw new Error('Failed to check conversion status');
          }
          
          const statusData = await statusResponse.json();
          console.log(`Task status: ${statusData.status}`);

          switch (statusData.status) {
            case 'pending':
            case 'processing':
              setProgress(prev => Math.min(prev + 5, 70));
              setTimeout(pollStatus, 3000);
              break;
              
            case 'completed':
              setStatus('downloading');
              setProgress(90);
              
              console.log('Task completed, starting file download');
              // Use download interface to trigger file download
              const downloadUrl = `/api/download?taskId=${taskId}`;
              const a = document.createElement('a');
              a.href = downloadUrl;
              // Set correct file extension based on conversion type
              const extension = getTargetExtension(convertType);
              a.download = pdfFile.name.replace(/\.[^/.]+$/, extension);
              a.click();

              setProgress(100);
              setStatus('idle');
              alert(t.convert.status.convertSuccess);
              window.location.reload();
              break;
              
            case 'failed':
              console.error('Task failed:', statusData.error);
              throw new Error(statusData.error || 'Conversion failed');
              
            default:
              throw new Error('Unknown status');
          }
        } catch (error) {
          setStatus('error');
          const errorMessage = error instanceof Error ? error.message : 'Error during conversion';
          alert(errorMessage);
          console.error('Conversion error:', errorMessage);
        }
      };

      // Start initial polling
      pollStatus();

    } catch (error) {
      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Error during conversion';
      alert(errorMessage);
      console.log('Conversion error:', errorMessage);
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return t.convert.status.uploading;
      case 'converting':
        return t.convert.status.converting;
      case 'downloading':
        return t.convert.status.downloading;
      case 'error':
        return t.convert.status.error;
      default:
        return '';
    }
  };

  const isLoading = status !== 'idle' && status !== 'error';

  return (
    <div className="flex gap-6">
      <div className="flex-1 overflow-auto">
        {!pdfFile ? (
          <FileUploadServer onFileSelect={handleFileSelect} convertType={convertType} />
        ) : (
          <div className="p-4">
            <div className="border rounded-lg p-4 max-w-md mx-auto">
              {isLoading && (
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {getStatusMessage()}
                  </div>
                </div>
              )}
              {thumbnailCanvas && (
                <canvas
                  width={thumbnailCanvas.width}
                  height={thumbnailCanvas.height}
                  className="w-full h-auto"
                  ref={(canvasRef) => {
                    if (canvasRef) {
                      const ctx = canvasRef.getContext('2d');
                      ctx?.drawImage(thumbnailCanvas, 0, 0);
                    }
                  }}
                />
              )}
              <div className="text-center mt-2">{pdfFile.name}</div>
            </div>
          </div>
        )}
      </div>

      {pdfFile && (
        <div className="w-80 shrink-0">
          <div className="p-4 border rounded-lg bg-white sticky top-4">
            {convertType === 'ocrpdf' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.tools.ocrPdf.selectLanguage}
                </label>
                <Select
                  isMulti
                  options={OCR_LANGUAGE_OPTIONS}
                  value={selectedLanguages}
                  onChange={(selected) => setSelectedLanguages(selected as typeof selectedLanguages)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                />
              </div>
            )}
            
            {convertType === 'compresspdf' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.tools.compressPdf.compressionQuality}
                  </label>
                  <select
                    value={compressionLevel}
                    onChange={(e) => setCompressionLevel(e.target.value as CompressionLevel)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                   
                    <option value="recommended">{t.tools.compressPdf.mediumCompression}</option>
                    <option value="extreme">{t.tools.compressPdf.highCompression}</option>
                  </select>
                </div>

                <button
                  onClick={handleConvert}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg text-white
                    ${isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-500 hover:bg-blue-600'
                    }
                    transition-colors duration-200
                  `}
                >
                  {isLoading ? getStatusMessage() : t.tools.compressPdf.compressButton}
                </button>
              </>
            ) : (
              <button
                onClick={handleConvert}
                disabled={isLoading}
                className={`w-full px-4 py-2 rounded-lg text-white
                  ${isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                  }
                  transition-colors duration-200
                `}
              >
                {isLoading ? getStatusMessage() : t.convert.button.convertAndDownload}
              </button>
            )}
          </div>
        </div>
      )}

     

     
    </div>
  );
} 