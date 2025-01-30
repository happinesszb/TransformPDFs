import { headers } from 'next/headers'
import { locales, type LocaleKey, getTranslations } from './i18n-client'

// 获取浏览器语言
export async function getBrowserLocale(): Promise<LocaleKey> {
  try {
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language') || ''
    const primaryLanguage = acceptLanguage.split(',')[0].trim().split('-')[0].toLowerCase()

    return primaryLanguage === 'zh' ? 'zh' :
           primaryLanguage === 'ar' ? 'ar' :
           primaryLanguage === 'fr' ? 'fr' :
           primaryLanguage === 'es' ? 'es' :
           primaryLanguage === 'pt' ? 'pt' : 'en'
  } catch (error) {
    return 'en'
  }
}

// 根据路径获取当前语言
export async function getCurrentLocale(params: { lang: string }): Promise<LocaleKey> {
  const lang = await Promise.resolve(params.lang);
  
  switch(lang) {
    case 'cn':
      return 'zh';
    case 'zh':
      return 'zh';
    case 'ar':
      return 'ar';
    case 'fr':
      return 'fr';
    case 'es':
      return 'es';
    case 'pt':
      return 'pt';
    default:
      return 'en';
  }
}

// 重新导出所需的内容
export { locales, type LocaleKey, getTranslations }