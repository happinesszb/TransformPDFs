'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

export default function PDFRemover() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [thumbnailCanvases, setThumbnailCanvases] = useState<HTMLCanvasElement[]>([]);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    try {
      setLoading(true);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdfDoc);
      setPageCount(pdfDoc.getPageCount());
      setSelectedPages([]);
      
      await generateThumbnails(pdfDoc);
    } catch (error) {
      console.error('There was an error loading the PDF file:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnails = async (pdfDoc: PDFDocument) => {
    try {
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
      }
      
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;
      
      const canvases: HTMLCanvasElement[] = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 0.3 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context!,
          viewport: viewport
        }).promise;

        canvases.push(canvas);
      }

      setThumbnailCanvases(canvases);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('An error occurred while generating the thumbnail:', error);
    }
  };

  const handleRemovePages = async () => {
    if (!pdfDoc || selectedPages.length === 0) return;
    
    try {
      setLoading(true);
      const newDoc = await PDFDocument.create();
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        if (!selectedPages.includes(i)) {
          const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
          newDoc.addPage(copiedPage);
        }
      }

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'removed_pages.pdf';
      a.click();
      URL.revokeObjectURL(url);

      setPdfDoc(newDoc);
      setPageCount(newDoc.getPageCount());
      setSelectedPages([]);
      await generateThumbnails(newDoc);
      window.location.reload();
    } catch (error) {
      console.error('An error occurred while deleting the page:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">The PDF file is being processed...</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        {!pdfDoc ? (
          <FileUploader onFileSelect={handleFileSelect} multiple={false} maxFiles={1} />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: pageCount }).map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedPages(prev =>
                    prev.includes(i)
                      ? prev.filter(p => p !== i)
                      : [...prev, i]
                  );
                }}
                className={`p-2 border rounded-lg cursor-pointer ${
                  selectedPages.includes(i)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-red-300'
                }`}
              >
                {thumbnailCanvases[i] && (
                  <canvas
                    width={thumbnailCanvases[i].width}
                    height={thumbnailCanvases[i].height}
                    className="w-full h-auto"
                    ref={(canvasRef) => {
                      if (canvasRef) {
                        const ctx = canvasRef.getContext('2d');
                        ctx?.drawImage(thumbnailCanvases[i], 0, 0);
                      }
                    }}
                  />
                )}
                <div className="text-center mt-2">Page {i + 1} </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium">{t.tools.deletePages.selectMultiple}</h3>
          
          <p className="text-sm text-gray-600 mt-2">
            {t.tools.deletePages.downloadInfo}
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white">
          <div className="font-medium mb-2">{t.tools.deletePages.totalPages}: {pageCount}</div>
          
          <button
            onClick={handleRemovePages}
            disabled={selectedPages.length === 0}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.deletePages.removeSelected}
          </button>
        </div>
      </div>
    </div>
  );
} 