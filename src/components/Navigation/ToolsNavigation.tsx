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
import { getCurrentLocale, getTranslations } from "@/utils/i18n";

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

type IconType = keyof typeof iconComponents;

interface Props {
    locale: "en" | "zh" | "ar" | "fr" | "es" | "pt"
}

export const ToolsNavigation: React.FC<Props> = async ({ locale: inputLocale }) => {
    const safeParams = await Promise.resolve(inputLocale);
    const locale = await getCurrentLocale({ lang: safeParams });
    const t = getTranslations(locale);

    const getLocalizedHref = (path: string) => {
        const langPrefix = locale === 'zh' ? '/cn' :
            locale === 'en' ? '/en' :
                `/${locale}`;
        return `${langPrefix}${path}`;
    };

    const toolCategories = [
        {
            title: t.nav.categories.convertFromPdf,
            items: [
                { toolKey: "pdfToWord", icon: "word", href: "/tools/pdf-to-word" },
                { toolKey: "pdfToPpt", icon: "powerpoint", href: "/tools/pdf-to-ppt" },
                { toolKey: "pdfToExcel", icon: "excel", href: "/tools/pdf-to-excel" },
                { toolKey: "pdfToJpg", icon: "image", href: "/tools/pdf-to-jpg" }
            ]
        },
        {
            title: t.nav.categories.convertToPdf,
            items: [
                { toolKey: "wordToPdf", icon: "word", href: "/tools/word-to-pdf" },
                { toolKey: "powerPointToPdf", icon: "powerpoint", href: "/tools/ppt-to-pdf" },
                { toolKey: "excelToPdf", icon: "excel", href: "/tools/excel-to-pdf" },
                { toolKey: "jpgToPdf", icon: "image", href: "/tools/jpg-to-pdf" }
            ]
        },

        {
            title: t.nav.categories.organize,
            items: [
                { toolKey: "mergePdf", icon: "merge", href: "/tools/merge-pdf" },
                { toolKey: "splitPdf", icon: "split", href: "/tools/split-pdf" },
                { toolKey: "compressPdf", icon: "compress", href: "/tools/compress-pdf" },
                { toolKey: "deletePages", icon: "delete", href: "/tools/remove-pages" },
                { toolKey: "extractPages", icon: "edit", href: "/tools/extract-pdf" },
                { toolKey: "rotatePdf", icon: "rotate", href: "/tools/rotate-pdf" }
            ]
        },
        
        {
            title: t.nav.categories.edit,
            items: [
                { toolKey: "editPdf", icon: "edit", href: "/tools/annotate-pdf" },
                { toolKey: "signPdf", icon: "sign", href: "/tools/sign-pdf" },
                { toolKey: "watermarkPdf", icon: "image", href: "/tools/watermark-pdf" },
                { toolKey: "pageNumberPdf", icon: "pageNumber", href: "/tools/page-number-pdf" }
               
               
            ]
        }

    ] as const;

    return (
        <nav className="w-full bg-white shadow-md py-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-4 gap-8">
                    {toolCategories.map((category) => (
                        <div key={category.title} className="flex flex-col">
                            <h3 className="font-semibold text-gray-900 mb-4">{category.title}</h3>
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
            </div>
        </nav>
    );
} 