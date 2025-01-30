import Image from "next/image"
import Link from "next/link"
import Navbar from "@/components/Navigation/Navbar"
import { getCurrentLocale, getTranslations } from "@/utils/i18n"
import type { Metadata } from "next"
import Footer from "@/components/Navigation/Footer"
import { 
  BsFilePdf,
  BsScissors,
  BsFileText,
  BsFileImage,
  BsFileImageFill,
  BsTrash,
  BsArrowClockwise,
  BsFileEarmarkText,
  BsFileWord,
  BsFileEarmarkPpt,
  BsFileExcel,
  BsPen,
  BsPencilSquare,
  BsLock,
  BsUnlock,
  BsPencil
} from "react-icons/bs"
import { ToolsNavigation } from "@/components/Navigation/ToolsNavigation"

interface Props {
  params: {
    lang: string
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const safeParams = await Promise.resolve(params);
  const locale = await getCurrentLocale(safeParams);
  const t = getTranslations(locale);

  return {
    title: t.metadata.title,
    description: t.metadata.description,
    alternates: {
      languages: {
        'en': '/en',
        'zh': '/cn',
        'ar': '/ar',
        'fr': '/fr',
        'es': '/es',
        'pt': '/pt',
      }
    }
  }
}

export default async function Home({ params }: Props) {
  const safeParams = await Promise.resolve(params);
  const locale = await getCurrentLocale(safeParams);
  const t = getTranslations(locale);

  const getLocalizedHref = (path: string) => {
    const langPrefix = locale === 'zh' ? '/cn' :
                      locale === 'en' ? '/en' :
                      `/${locale}`;
    return `${langPrefix}${path}`;
  };

  const toolCards = [
    {
      href: getLocalizedHref("/tools/merge-pdf"),
      icon: <BsFilePdf />,
      iconColor: "text-red-500",
      tool: "mergePdf"
    },
    {
      href: getLocalizedHref("/tools/split-pdf"),
      icon: <BsScissors />,
      iconColor: "text-orange-500",
      tool: "splitPdf"
    },
    {
      href: getLocalizedHref("/tools/compress-pdf"),
      icon: <BsFileText />,
      iconColor: "text-green-500",
      tool: "compressPdf"
    },
    {
      href: getLocalizedHref("/tools/ocr-pdf"),
      icon: <BsFileEarmarkText />,
      iconColor: "text-purple-500",
      tool: "ocrPdf"
    },
    {
      href: getLocalizedHref("/tools/pdf-to-word"),
      icon: <BsFileWord />,
      iconColor: "text-blue-500",
      tool: "pdfToWord"
    },
    
    {
      href: getLocalizedHref("/tools/pdf-to-ppt"),
      icon: <BsFileEarmarkPpt />,
      iconColor: "text-blue-500",
      tool: "pdfToPpt"
    },
    {
      href: getLocalizedHref("/tools/pdf-to-excel"),
      icon: <BsFileExcel />,
      iconColor: "text-green-500",
      tool: "pdfToExcel"
    },
    {
      href: getLocalizedHref("/tools/word-to-pdf"),
      icon: <BsFileWord />,
      iconColor: "text-blue-500",
      tool: "wordToPdf"
    },
    {
      href: getLocalizedHref("/tools/ppt-to-pdf"),
      icon: <BsFileEarmarkPpt />,
      iconColor: "text-orange-500",
      tool: "powerPointToPdf"
    },
    {
      href: getLocalizedHref("/tools/excel-to-pdf"),
      icon: <BsFileExcel />,
      iconColor: "text-green-500",
      tool: "excelToPdf"
    },
    {
      href: getLocalizedHref("/tools/pdf-to-jpg"),
      icon: <BsFileImage />,
      iconColor: "text-purple-500",
      tool: "pdfToJpg"
    },
    {
      href: getLocalizedHref("/tools/jpg-to-pdf"),
      icon: <BsFileImageFill />,
      iconColor: "text-purple-500",
      tool: "jpgToPdf"
    },
    {
      href: getLocalizedHref("/tools/remove-pages"),
      icon: <BsTrash />,
      iconColor: "text-purple-500",
      tool: "deletePages"
    },
    {
      href: getLocalizedHref("/tools/extract-pdf"),
      icon: <BsFileEarmarkText />,
      iconColor: "text-purple-500",
      tool: "extractPages"
    },
    {
      href: getLocalizedHref("/tools/rotate-pdf"),
      icon: <BsArrowClockwise />,
      iconColor: "text-purple-500",
      tool: "rotatePdf"
    },
    {
      href: getLocalizedHref("/tools/annotate-pdf"),
      icon: <BsPencil />,
      iconColor: "text-purple-500",
      tool: "annotatePdf"
    },
    {
      href: getLocalizedHref("/tools/sign-pdf"),
      icon: <BsPencilSquare />,
      iconColor: "text-orange-500",
      tool: "signPdf"
    },
    {
      href: getLocalizedHref("/tools/watermark-pdf"),
      icon: <BsFileText />,
      iconColor: "text-blue-500",
      tool: "watermarkPdf"
    },
    {
      href: getLocalizedHref("/tools/page-number-pdf"),
      icon: <BsFileText />,
      iconColor: "text-green-500",
      tool: "pageNumberPdf"
    },
    {
      href: getLocalizedHref("/tools/encrypt-pdf"),
      icon: <BsLock />,
      iconColor: "text-red-500",
      tool: "encryptPdf"
    },
    {
      href: getLocalizedHref("/tools/unlock-pdf"),
      icon: <BsUnlock />,
      iconColor: "text-orange-500",
      tool: "unlockPdf"
    }
  ] as const

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t.home.toolsSection.title}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                {t.home.toolsSection.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {toolCards.map((card) => (
                <Link key={card.href} href={card.href} className="block">
                  <div className="h-full bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start">
                      <div className={`${card.iconColor} text-4xl mb-4`}>
                        {card.icon}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {t.toolsbar[card.tool].title}
                        </h3>
                        <p className="text-gray-600">
                          {t.toolsbar[card.tool].description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-6 py-20 flex items-center justify-between">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold mb-6">
              {t.home.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t.home.description}
            </p>
            <div className="flex gap-4">
              <Link 
                href={getLocalizedHref("/pricing")} 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              >
                {t.auth.becomeMember}
              </Link>
            </div>
          </div>
          <div className="w-[600px] h-[390px] relative">
            <Image
              src="/images/home/pdf-docs.png"
              alt="Document management illustration"
              fill
              className="object-contain"
            />
          </div>
        </section>
      </main>
      <ToolsNavigation locale={locale} />
      <Footer />
    </div>
  )
} 