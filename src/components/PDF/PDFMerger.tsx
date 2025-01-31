'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

interface PDFFile {
  id: string;
  file: File;
  thumbnail: HTMLCanvasElement | null;
}

export default function PDFMerger() {
  const { t } = useLocale();
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const generateThumbnail = async (file: File): Promise<HTMLCanvasElement | null> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
      }
      
      const loadingTask = pdfjsLib.getDocument(url);
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

      URL.revokeObjectURL(url);
      return canvas;
    } catch (error) {
      console.error('error:', error);
      return null;
    }
  };

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    setLoading(true);
    try {
      const newPdfFiles: PDFFile[] = [];
      for (const file of files) {
        const thumbnail = await generateThumbnail(file);
        newPdfFiles.push({ 
          id: Math.random().toString(36).substr(2, 9),
          file, 
          thumbnail 
        });
      }
      setPdfFiles(newPdfFiles);
    } catch (error) {
      console.error('error:', error);
    }
    setLoading(false);
  };

  const handleMergePDF = async () => {
    if (pdfFiles.length === 0) return;
    
    try {
      setLoading(true);
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(url);
      window.location.reload();
    } catch (error) {
      console.error('error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedItem === null) return;

    const newPdfFiles = [...pdfFiles];
    const [draggedFile] = newPdfFiles.splice(draggedItem, 1);
    newPdfFiles.splice(dropIndex, 0, draggedFile);
    setPdfFiles(newPdfFiles);
    setDraggedItem(null);
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.mergePages.processingMessage}</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        {pdfFiles.length === 0 ? (
          <FileUploader onFileSelect={handleFileSelect} multiple={true} maxFiles={10000} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {pdfFiles.map((pdfFile, index) => (
              <div
                key={pdfFile.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`p-2 border rounded-lg cursor-move transition-transform ${
                  draggedItem === index 
                    ? 'opacity-50 border-blue-500' 
                    : 'hover:border-blue-300'
                }`}
              >
                {pdfFile.thumbnail && (
                  <canvas
                    width={pdfFile.thumbnail.width}
                    height={pdfFile.thumbnail.height}
                    className="w-full h-auto pointer-events-none"
                    ref={(canvasRef) => {
                      if (canvasRef) {
                        const ctx = canvasRef.getContext('2d');
                        ctx?.drawImage(pdfFile.thumbnail!, 0, 0);
                      }
                    }}
                  />
                )}
                <div className="mt-2 pointer-events-none">
                  <div className="text-sm font-medium truncate">
                    {pdfFile.file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(pdfFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {t.tools.mergePages.dragToReorder}{index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pdfFiles.length > 0 && (
        <div className="w-80 shrink-0 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium">{t.tools.mergePages.selectFiles}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {t.tools.mergePages.downloadInfo}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-white">
            <div className="font-medium mb-2">{t.tools.mergePages.totalFiles}: {pdfFiles.length}</div>
            <button
              onClick={handleMergePDF}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {t.tools.mergePages.mergeButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 