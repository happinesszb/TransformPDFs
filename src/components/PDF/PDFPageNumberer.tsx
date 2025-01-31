'use client';

import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

export default function PDFPageNumberer() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    try {
      setLoading(true);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdfDoc);
      
      // 
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Load PDF file error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPageNumbers = async () => {
    if (!pdfDoc) return;
    
    try {
      setLoading(true);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      const fontSize = 12;

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const pageNumber = `${index + 1} / ${pages.length}`;
        const textWidth = font.widthOfTextAtSize(pageNumber, fontSize);
        
        page.drawText(pageNumber, {
          x: (width - textWidth) / 2,
          y: 30, 
          size: fontSize,
          font: font,
          color: rgb(0, 0, 0),
        });
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `numbered.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      window.location.reload();
    } catch (error) {
      console.error('Add page numbers error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.pageNumberPdf.processing}</div>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 overflow-auto">
        {!pdfDoc ? (
          <FileUploader onFileSelect={handleFileSelect} multiple={false} maxFiles={1} />
        ) : (
          <div className="w-full h-[calc(100vh-200px)] overflow-y-auto">
            <embed 
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              className="border rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="w-80 shrink-0">
        <div className="p-4 border rounded-lg bg-white sticky top-4">
          <button
            onClick={handleAddPageNumbers}
            disabled={!pdfDoc}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.pageNumberPdf.addPageNumbers}
          </button>
        </div>
      </div>
    </div>
  );
} 