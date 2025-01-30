import en from '@/locales/en'
import zh from '@/locales/zh'
import ar from '@/locales/ar'
import fr from '@/locales/fr'
import es from '@/locales/es'
import pt from '@/locales/pt'
import type { LocaleType } from '@/locales/types'

export const locales = {
  en,  // 英语
  zh,  // 中文
  ar,  // 阿拉伯语
  fr,  // 法语
  es,  // 西班牙语
  pt   // 葡萄牙语
} as const

export type LocaleKey = keyof typeof locales

// 语言路径映射
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