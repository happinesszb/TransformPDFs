'use client';
import { useLocale } from '@/hooks/useLocale';
import { 
  BsFileWord,
  BsFileExcel,
  BsFileEarmarkPpt,
  BsFileImage,
  BsFilePdf,
  BsFileText,
  BsFileEarmarkText,
  BsFileEarmarkRichtext,
  BsFileEarmarkPdf
} from "react-icons/bs";
import Link from 'next/link';
import type { ToolKeys } from '@/locales/types';

interface ConvertDropdownProps {
  onClose: () => void;
}

type IconType = keyof typeof iconComponents;

const iconComponents = {
  pdf: BsFilePdf,
  word: BsFileWord,
  excel: BsFileExcel,
  powerpoint: BsFileEarmarkPpt,
  image: BsFileImage,
  text: BsFileText,
  rtf: BsFileEarmarkRichtext,
  epub: BsFileEarmarkText,
  pdfa: BsFileEarmarkPdf
} as const;

const iconColors = {
  pdf: "#FF0000",
  word: "#2B579A",
  excel: "#217346",
  powerpoint: "#B7472A",
  image: "#4CAF50",
  text: "#607D8B",
  rtf: "#FF9800",
  epub: "#9C27B0",
  pdfa: "#E91E63"
} as const;

export default function ConvertDropdown({ onClose }: ConvertDropdownProps) {
  const { t, locale } = useLocale();
  
  const getLocalizedHref = (path: string) => {
    const langPrefix = locale === 'zh' ? '/cn' :
                      locale === 'en' ? '/en' :
                      `/${locale}`;
    return `${langPrefix}${path}`;
  };

  if (!t?.toolsbar || !t?.nav?.categories) {
    return null;
  }

  const toolCategories = [
    {
      title: t.nav.categories.convertFromPdf,
      items: [
        { 
          toolKey: 'pdfToWord' as ToolKeys,
          icon: "word", 
          href: "/tools/pdf-to-word"
        },
        { 
          toolKey: 'pdfToExcel' as ToolKeys,
          icon: "excel", 
          href: "/tools/pdf-to-excel"
        },
        { 
          toolKey: 'pdfToPpt' as ToolKeys,
          icon: "powerpoint", 
          href: "/tools/pdf-to-ppt"
        },
        { 
          toolKey: 'pdfToJpg' as ToolKeys,
          icon: "image", 
          href: "/tools/pdf-to-jpg"
        },
        { 
          toolKey: 'pdfToHtml' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-html"
        },
        { 
          toolKey: 'pdfToEpub' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-epub"
        },
        { 
          toolKey: 'pdfToTiff' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-tiff"
        },
        { 
          toolKey: 'pdfToTex' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-tex"
        },
        { 
          toolKey: 'pdfToSvg' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-svg"
        },
        { 
          toolKey: 'pdfToXml' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-xml"
        },
        { 
          toolKey: 'pdfToMobi' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-mobi"
        },
        { 
          toolKey: 'pdfToXps' as ToolKeys,
          icon: "epub", 
          href: "/tools/pdf-to-xps"
        }
      ]
    },
    {
      title: t.nav.categories.convertToPdf,
      items: [
        {
          toolKey: 'wordToPdf' as ToolKeys,
          icon: "word",
          href: "/tools/word-to-pdf"
        },
        {
          toolKey: 'powerPointToPdf' as ToolKeys,
          icon: "powerpoint",
          href: "/tools/ppt-to-pdf"
        },
        {
          toolKey: 'excelToPdf' as ToolKeys,
          icon: "excel",
          href: "/tools/excel-to-pdf"
        },
        {
          toolKey: 'jpgToPdf' as ToolKeys,
          icon: "image",
          href: "/tools/jpg-to-pdf"
        },
        {
          toolKey: 'epubToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/epub-to-pdf"
        },
        {
          toolKey: 'htmlToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/html-to-pdf"
        },
        {
          toolKey: 'texToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/tex-to-pdf"
        },
        {
          toolKey: 'psToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/ps-to-pdf"
        },
        {
          toolKey: 'xslfoToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/xslfo-to-pdf"
        },
        {
          toolKey: 'pclToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/pcl-to-pdf"
        },
        {
          toolKey: 'svgToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/svg-to-pdf"
        },
        {
          toolKey: 'xmlToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/xml-to-pdf"
        },
        {
          toolKey: 'mdToPdf' as ToolKeys,
          icon: "epub",
          href: "/tools/md-to-pdf"
        }
      ]
    }
  ] as const;

  return (
    <div className="absolute top-full left-0 mt-2 w-[1000px] bg-white rounded-lg shadow-xl p-6 grid grid-cols-5 gap-4">
      {toolCategories.map((category) => (
        <div key={category.title} className="flex flex-col">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 mb-4">{category.title}</h3>
          </div>
          <ul className="space-y-3">
            {category.items.map((item) => {
              const IconComponent = iconComponents[item.icon as IconType];
              const toolTitle = t.toolsbar[item.toolKey]?.title;
              if (!toolTitle) return null;

              return (
                <li key={item.toolKey}>
                  <Link
                    href={getLocalizedHref(item.href)}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ color: iconColors[item.icon as keyof typeof iconColors] }}
                    />
                    <span>{toolTitle}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
} 