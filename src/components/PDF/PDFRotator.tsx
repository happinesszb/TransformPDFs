'use client';

import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

export default function PDFRotator() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [thumbnailCanvases, setThumbnailCanvases] = useState<HTMLCanvasElement[]>([]);
  const [rotations, setRotations] = useState<number[]>([]);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    try {
      setLoading(true);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdfDoc);
      setPageCount(pdfDoc.getPageCount());
      setRotations(new Array(pdfDoc.getPageCount()).fill(0));
      
      await generateThumbnails(pdfDoc);
    } catch (error) {
      console.error('error', error);
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
      console.error('生成缩略图时出错:', error);
    }
  };

  const handleRotate = (pageIndex: number) => {
    setRotations(prev => {
      const newRotations = [...prev];
      newRotations[pageIndex] = (newRotations[pageIndex] + 90) % 360;
      return newRotations;
    });
  };

  const handleSaveAndDownload = async () => {
    if (!pdfDoc) return;
    
    try {
      setLoading(true);
      const newPdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < pageCount; i++) {
        const [page] = await newPdfDoc.copyPages(pdfDoc, [i]);
        const originalRotation = pdfDoc.getPage(i).getRotation().angle;
        const newRotation = (originalRotation + rotations[i]) % 360;
        page.setRotation(degrees(newRotation));
        newPdfDoc.addPage(page);
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `rotated.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      window.location.reload();
    } catch (error) {
      console.error('err:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.rotatePdf.processingMessage}</div>;
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {Array.from({ length: pageCount }).map((_, i) => (
              <div key={i} className="relative">
                <div className="border rounded-lg p-2">
                  {thumbnailCanvases[i] && (
                    <div style={{ transform: `rotate(${rotations[i]}deg)` }} className="transition-transform duration-300">
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
                    </div>
                  )}
                  <div className="text-center mt-2">{t.tools.rotatePdf.page} {i + 1}</div>
                  <button
                    onClick={() => handleRotate(i)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                    title={t.tools.rotatePdf.rotateButton}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0">
        <div className="p-4 border rounded-lg bg-white sticky top-4">
          <div className="font-medium mb-2">{t.tools.rotatePdf.totalPages}: {pageCount}</div>
          <p className="text-sm text-gray-600 mb-4">
            {t.tools.rotatePdf.downloadInfo}
          </p>
          <button
            onClick={handleSaveAndDownload}
            disabled={!pdfDoc}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.rotatePdf.saveAndDownload}
          </button>
        </div>
      </div>
    </div>
  );
} 