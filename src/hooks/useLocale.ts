'use client';
import { usePathname } from 'next/navigation';
import { getTranslations, type LocaleKey, pathLocaleMap } from '@/utils/i18n-client';

export function useLocale() {
  const pathname = usePathname();
  const pathSegment = `/${pathname.split('/')[1]}` || '/';
  
  const locale: LocaleKey = pathLocaleMap[pathSegment] || 'en';
  const t = getTranslations(locale);
  
  const langPrefix = locale === 'en' ? '' : pathSegment;
  
  return { locale, t, langPrefix };
} 