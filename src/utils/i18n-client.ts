import en from '@/locales/en'
import zh from '@/locales/zh'
import ar from '@/locales/ar'
import fr from '@/locales/fr'
import es from '@/locales/es'
import pt from '@/locales/pt'
import type { LocaleType } from '@/locales/types'

export const locales = {
  en,  //  
  zh,  //  
  ar,  //  
  fr,  //  
  es,  //  
  pt   //  
} as const

export type LocaleKey = keyof typeof locales

//  
export const pathLocaleMap: Record<string, LocaleKey> = {
  '/': 'en',
  '/cn': 'zh',
  '/ar': 'ar',
  '/fr': 'fr',
  '/es': 'es',
  '/pt': 'pt'
}

export function getTranslations(locale: LocaleKey): LocaleType {
  return locales[locale]
} 