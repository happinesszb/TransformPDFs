'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

export default function PDFExtractor() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [thumbnailCanvases, setThumbnailCanvases] = useState<HTMLCanvasElement[]>([]);
  const [mergeOutput, setMergeOutput] = useState(true);

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
      console.error('Loading PDF error:', error);
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
      console.error('Error:', error);
    }
  };

  const handleExtractPDF = async () => {
    if (!pdfDoc || selectedPages.length === 0) return;
    
    try {
      setLoading(true);
      
      if (mergeOutput) {
        // 
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(pdfDoc, selectedPages);
        pages.forEach(page => newDoc.addPage(page));
        
        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `extracted_pages.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        
        for (const pageIndex of selectedPages) {
          const newDoc = await PDFDocument.create();
          const [page] = await newDoc.copyPages(pdfDoc, [pageIndex]);
          newDoc.addPage(page);
          
          const pdfBytes = await newDoc.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `page_${pageIndex + 1}.pdf`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.extractPages.processingMessage}</div>;
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
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(i)}
                      onChange={() => {
                        setSelectedPages(prev =>
                          prev.includes(i)
                            ? prev.filter(p => p !== i)
                            : [...prev, i]
                        );
                      }}
                      className="w-4 h-4"
                    />
                  </div>
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
                  <div className="text-center mt-2"> {i + 1} </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg sticky top-4">
          <h3 className="font-medium">{t.tools.extractPages.selectPages}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t.tools.extractPages.downloadInfo}
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white sticky top-48">
          <div className="font-medium mb-2">{t.tools.extractPages.totalPages}: {pageCount}</div>
          <div className="font-medium mb-2">{t.tools.extractPages.selectedPages}: {selectedPages.length}</div>
          
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={mergeOutput}
                onChange={(e) => setMergeOutput(e.target.checked)}
                className="w-4 h-4"
              />
              <span>{t.tools.extractPages.mergeOption}</span>
            </label>
          </div>
          
          <button
            onClick={handleExtractPDF}
            disabled={selectedPages.length === 0}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.extractPages.extractButton}
          </button>
        </div>
      </div>
    </div>
  );
} 