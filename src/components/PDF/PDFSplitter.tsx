'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

export default function PDFSplitter() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitPoints, setSplitPoints] = useState<number[]>([]);
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
      setSplitPoints([]);
      
      await generateThumbnails(pdfDoc);
    } catch (error) {
      console.error('加载 PDF 文件时出错:', error);
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
      console.error('err:', error);
    }
  };

  const handleSplitPDF = async () => {
    if (!pdfDoc || splitPoints.length === 0) return;
    
    try {
      setLoading(true);
      const sortedSplitPoints = [...splitPoints].sort((a, b) => a - b);
      const documents: PDFDocument[] = [];
      
      let startPage = 0;
      for (const splitPoint of [...sortedSplitPoints, pageCount]) {
        const newDoc = await PDFDocument.create();
        const pages = await newDoc.copyPages(pdfDoc, Array.from(
          { length: splitPoint - startPage },
          (_, i) => startPage + i
        ));
        pages.forEach(page => newDoc.addPage(page));
        documents.push(newDoc);
        startPage = splitPoint;
      }

      // 
      for (let i = 0; i < documents.length; i++) {
        const pdfBytes = await documents[i].save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `split_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        window.location.reload();
      }
    } catch (error) {
      console.error('err:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.splitPages.processingMessage}</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 overflow-auto">
        {!pdfDoc ? (
          <FileUploader onFileSelect={handleFileSelect} multiple={false} maxFiles={1} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {Array.from({ length: pageCount }).map((_, i) => (
              <div key={i} className="relative">
                <div className="border rounded-lg p-2">
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
                  <div className="text-center mt-2">第 {i + 1} 页</div>
                </div>
                
                {i < pageCount - 1 && (
                  <div
                    onClick={() => {
                      setSplitPoints(prev =>
                        prev.includes(i + 1)
                          ? prev.filter(p => p !== i + 1)
                          : [...prev, i + 1]
                      );
                    }}
                    className={`absolute top-0 right-0 h-full w-4 cursor-pointer group -mr-2 ${
                      splitPoints.includes(i + 1) ? 'bg-blue-100' : 'hover:bg-blue-50'
                    }`}
                  >
                    <div className={`h-full flex items-center justify-center ${
                      splitPoints.includes(i + 1)
                        ? 'border-l-2 border-blue-500'
                        : 'border-l-2 border-dashed border-gray-300 group-hover:border-blue-300'
                    }`}>
                      {splitPoints.includes(i + 1) && (
                        <div className="flex justify-center -ml-3">
                          <span className="bg-blue-500 text-white p-1 rounded-full">
                            ✂️
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-80 shrink-0 space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg sticky top-4">
          <h3 className="font-medium">{t.tools.splitPages.selectSplitPoints}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {t.tools.splitPages.downloadInfo}
          </p>
        </div>

        <div className="p-4 border rounded-lg bg-white sticky top-48">
          <div className="font-medium mb-2">{t.tools.splitPages.totalPages}: {pageCount}</div>
          <div className="font-medium mb-2">{t.tools.splitPages.splitPoints}: {splitPoints.length}</div>
          
          <button
            onClick={handleSplitPDF}
            disabled={splitPoints.length === 0}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.splitPages.splitButton}
          </button>
        </div>
      </div>
    </div>
  );
} 