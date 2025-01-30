'use client';

import { useState, useEffect } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import FileUploader from './FileUploader';
import { useLocale } from '@/hooks/useLocale';

interface WatermarkSettings {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
}

export default function PDFWatermarker() {
  const { t } = useLocale();
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');

  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    text: '',
    fontSize: 48,
    color: '#FF0000',
    opacity: 0.5,
    rotation: -45
  });

  const updatePreview = async () => {
    if (!pdfDoc) return;
    
    try {
      // 创建一个新的PDF文档副本用于预览
      const previewDoc = await PDFDocument.load(await pdfDoc.save());
      const pages = previewDoc.getPages();
      
      if (watermarkSettings.text) {
        pages.forEach(page => {
          const { width, height } = page.getSize();
          const [r, g, b] = hexToRgb(watermarkSettings.color);
          
          page.drawText(watermarkSettings.text, {
            x: width / 2,
            y: height / 2,
            size: watermarkSettings.fontSize,
            color: rgb(r, g, b),
            opacity: watermarkSettings.opacity,
            rotate: degrees(watermarkSettings.rotation),
          });
        });
      }

      const pdfBytes = await previewDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // 清理旧的URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(url);
    } catch (error) {
      console.error('Error updating preview:', error);
    }
  };

  // 当水印设置改变时更新预览
  useEffect(() => {
    updatePreview();
  }, [watermarkSettings]);

  const handleFileSelect = async (files: File[]) => {
    if (!files.length) return;
    
    try {
      setLoading(true);
      const arrayBuffer = await files[0].arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(pdfDoc);
      
      // 初始预览
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error loading PDF file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWatermark = async () => {
    if (!pdfDoc || !watermarkSettings.text) return;
    
    try {
      setLoading(true);
      // 直接使用当前预览的PDF作为最终结果
      const blob = await fetch(pdfUrl).then(r => r.blob());
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `watermarked.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      window.location.reload();
    } catch (error) {
      console.error('Error adding watermark:', error);
    } finally {
      setLoading(false);
    }
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [0, 0, 0];
  };

  if (loading) {
    return <div className="text-center py-8">{t.tools.watermarkPdf.settings.processing}</div>;
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

      <div className="w-80 shrink-0 space-y-4">
        <div className="p-4 border rounded-lg bg-white sticky top-4">
          <button
            onClick={handleAddWatermark}
            disabled={!pdfDoc || !watermarkSettings.text}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t.tools.watermarkPdf.settings.addWatermark}
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg sticky top-20">
          <h3 className="font-medium">{t.tools.watermarkPdf.settings.settings}</h3>
          <div className="space-y-4 mt-4">
            <input
              type="text"
              value={watermarkSettings.text}
              onChange={(e) => setWatermarkSettings(prev => ({ ...prev, text: e.target.value }))}
              placeholder={t.tools.watermarkPdf.settings.watermarkText}
              className="w-full px-3 py-2 border rounded-lg"
            />
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.tools.watermarkPdf.settings.fontSize}</label>
              <input
                type="number"
                value={watermarkSettings.fontSize}
                onChange={(e) => setWatermarkSettings(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
                max="200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.tools.watermarkPdf.settings.color}</label>
              <input
                type="color"
                value={watermarkSettings.color}
                onChange={(e) => setWatermarkSettings(prev => ({ ...prev, color: e.target.value }))}
                className="w-full h-10 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.tools.watermarkPdf.settings.opacity}</label>
              <select
                value={watermarkSettings.opacity}
                onChange={(e) => setWatermarkSettings(prev => ({ ...prev, opacity: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="0.25">25%</option>
                <option value="0.5">50%</option>
                <option value="0.75">75%</option>
                <option value="1">100%</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">{t.tools.watermarkPdf.settings.rotation}</label>
              <select
                value={watermarkSettings.rotation}
                onChange={(e) => setWatermarkSettings(prev => ({ ...prev, rotation: Number(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="45">45°</option>
                <option value="90">90°</option>
                <option value="180">180°</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 