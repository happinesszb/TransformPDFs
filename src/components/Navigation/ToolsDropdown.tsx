'use client';
import { useLocale } from '@/hooks/useLocale';
import { 
  BsFileWord,
  BsFileExcel,
  BsFileEarmarkPpt,
  BsFileZip,
  BsFileImage,
  BsFiles,
  BsScissors,
  BsTrash,
  BsPencil,
  BsArrowClockwise,
  BsFileText,
  BsPen,
  BsPencilSquare,
  BsLock,
  BsUnlock
} from "react-icons/bs";
import Link from 'next/link';
import type { ToolKeys } from '@/locales/types';

interface ToolsDropdownProps {
  onClose: () => void;
}

type IconType = keyof typeof iconComponents;

const iconComponents = {
  compress: BsFileZip,
  word: BsFileWord,
  excel: BsFileExcel,
  powerpoint: BsFileEarmarkPpt,
  image: BsFileImage,
  merge: BsFiles,
  split: BsScissors,
  delete: BsTrash,
  edit: BsPencil,
  rotate: BsArrowClockwise,
  ocr: BsFileText,
  sign: BsPencilSquare,
  pageNumber: BsFileText,
  watermark: BsFileText,
  encrypt: BsLock,
  unlock: BsUnlock
} as const;

const iconColors = {
  word: "#2B579A",
  excel: "#217346",
  powerpoint: "#B7472A",
  compress: "#FFB71B",
  image: "#4CAF50",
  merge: "#2196F3",
  split: "#FF9800",
  delete: "#F44336",
  edit: "#673AB7",
  ocr: "#9C27B0",
  sign: "#FF5722",
  rotate: "#FF5722",
  encrypt: "#FF5722",
  unlock: "#FF5722"
} as const;

export default function ToolsDropdown({ onClose }: ToolsDropdownProps) {
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
      title: t.nav.categories.optimize,
      items: [
        { 
          toolKey: 'compressPdf' as ToolKeys,
          icon: "compress", 
          href: "/tools/compress-pdf"
        },
        { 
          toolKey: 'ocrPdf' as ToolKeys,
          icon: "ocr", 
          href: "/tools/ocr-pdf"
        }
      ]
    },
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
        }
      ]
    },
    {
      title: t.nav.categories.organize,
      items: [
        { 
          toolKey: 'mergePdf' as ToolKeys,
          icon: "merge", 
          href: "/tools/merge-pdf"
        },
        { 
          toolKey: 'splitPdf' as ToolKeys,
          icon: "split", 
          href: "/tools/split-pdf"
        },
        { 
          toolKey: 'deletePages' as ToolKeys,
          icon: "delete", 
          href: "/tools/remove-pages"
        },
        { 
          toolKey: 'extractPages' as ToolKeys,
          icon: "split", 
          href: "/tools/extract-pdf"
        },
        { 
          toolKey: 'rotatePdf' as ToolKeys,
          icon: "rotate", 
          href: "/tools/rotate-pdf"
        }
      ]
    },
    
    {
      title: t.nav.categories.encrypt,
      items: [
        { 
          toolKey: 'encryptPdf' as ToolKeys,
          icon: "encrypt", 
          href: "/tools/encrypt-pdf"
        },
        { 
          toolKey: 'unlockPdf' as ToolKeys,
          icon: "unlock", 
          href: "/tools/unlock-pdf"
        }
      ]
    },
    {
      title: t.nav.categories.edit,
      items: [
        { 
          toolKey: 'annotatePdf' as ToolKeys,
          icon: "edit", 
          href: "/tools/annotate-pdf"
        },
        { 
          toolKey: 'signPdf' as ToolKeys,
          icon: "sign", 
          href: "/tools/sign-pdf"
        },
        { 
          toolKey: 'pageNumberPdf' as ToolKeys,
          icon: "pageNumber", 
          href: "/tools/page-number-pdf"
        },
        { 
          toolKey: 'watermarkPdf' as ToolKeys,
          icon: "image", 
          href: "/tools/watermark-pdf"
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
              const toolDescription = t.toolsbar[item.toolKey]?.description;
              if (!toolTitle) return null;

              return (
                <li key={item.toolKey}>
                  <Link
                    href={getLocalizedHref(item.href)}
                    className="flex items-center gap-3 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                    title={toolDescription}
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