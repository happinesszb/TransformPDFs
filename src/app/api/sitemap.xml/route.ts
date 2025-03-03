import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const languages = ['en', 'cn', 'ar', 'fr', 'es', 'pt']
  const tools = [
    'pdf-to-word',
    'pdf-to-ppt',
    'pdf-to-excel',
    'pdf-to-jpg',
    'word-to-pdf',
    'ppt-to-pdf',
    'excel-to-pdf',
    'jpg-to-pdf',
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'remove-pages',
    'extract-pdf',
    'rotate-pdf',
    'ocr-pdf',
    'annotate-pdf',
    'sign-pdf',
    'page-number-pdf',
    'watermark-pdf',
    'unlock-pdf',
    'encrypt-pdf',
    'pdf-to-html',
    'pdf-to-epub',
    'epub-to-pdf',
    'html-to-pdf',
    'tex-to-pdf',
    'ps-to-pdf',
    'xslfo-to-pdf',
    'svg-to-pdf',
    'pcl-to-pdf',
    'xml-to-pdf',
    'md-to-pdf',
    'pdf-to-tiff',
    'pdf-to-mobi',
    'pdf-to-xps',
    'pdf-to-tex',
    'pdf-to-svg',
    'pdf-to-xml'
  ]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // 添加主页URL
  languages.forEach(lang => {
    xml += `  <url>\n`
    xml += `    <loc>https://transformpdfs.com/${lang}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>1.0</priority>\n`
    xml += `  </url>\n`
  })

  // 添加工具页面URL
  languages.forEach(lang => {
    tools.forEach(tool => {
      xml += `  <url>\n`
      xml += `    <loc>https://transformpdfs.com/${lang}/tools/${tool}</loc>\n`
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += `  </url>\n`
    })

    // 添加定价页面
    xml += `  <url>\n`
    xml += `    <loc>https://transformpdfs.com/${lang}/pricing</loc>\n`
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.7</priority>\n`
    xml += `  </url>\n`
  })

  // 添加博客主页（博客是单语言的，不需要语言前缀）
  xml += `  <url>\n`
  xml += `    <loc>https://transformpdfs.com/blog</loc>\n`
  xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
  xml += `    <changefreq>daily</changefreq>\n`
  xml += `    <priority>0.9</priority>\n`
  xml += `  </url>\n`

  xml += '</urlset>'

  // 设置正确的响应头
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex'
    },
  })
} 