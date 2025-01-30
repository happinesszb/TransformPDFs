import { Metadata } from 'next';
import Navbar from "@/components/Navigation/Navbar";
import { getCurrentLocale, getTranslations } from "@/utils/i18n";
import PDFAnnotator from "@/components/PDF/PDFAnnotator";

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
    title: "PDF签名工具",
    description: "在PDF文档上添加手写签名，图片印章或者文字签名",
  }
}

export default async function SignPDFPage({ params }: Props) {
  const safeParams = await Promise.resolve(params);
  const locale = await getCurrentLocale(safeParams);
  const t = getTranslations(locale);
  
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t.tools.signPdf.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.tools.signPdf.description}
            </p>
          </div>
          
          <div className="pb-12">
            <PDFAnnotator />
          </div>
        </div>
      </div>
    </div>
  );
} 