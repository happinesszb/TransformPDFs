import { Metadata } from 'next';
import Navbar from "@/components/Navigation/Navbar";
import { getCurrentLocale, getTranslations } from "@/utils/i18n";
import PDFExtractor from "@/components/PDF/PDFExtractor";

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
    title: t.tools.extractPages.title,
    description: t.tools.extractPages.description,
  }
}

export default async function ExtractPDFPage({ params }: Props) {
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
              {t.tools.extractPages.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t.tools.extractPages.description}
            </p>
          </div>
          
          <div className="pb-12">
            <PDFExtractor />
          </div>
        </div>
      </div>
    </div>
  );
} 