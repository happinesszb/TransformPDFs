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
  ]

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  // 
  languages.forEach(lang => {
    xml += `  <url>\n`
    xml += `    <loc>https://transformpdfs.com/${lang}</loc>\n`
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>1.0</priority>\n`
    xml += `  </url>\n`
  })

  // 
  languages.forEach(lang => {
    tools.forEach(tool => {
      xml += `  <url>\n`
      xml += `    <loc>https://transformpdfs.com/${lang}/tools/${tool}</loc>\n`
      xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
      xml += `    <changefreq>weekly</changefreq>\n`
      xml += `    <priority>0.8</priority>\n`
      xml += `  </url>\n`
    })

    // 
    xml += `  <url>\n`
    xml += `    <loc>https://transformpdfs.com/${lang}/pricing</loc>\n`
    xml += `    <lastmod>${new Date().toISOString()}</lastmod>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>0.7</priority>\n`
    xml += `  </url>\n`
  })

  xml += '</urlset>'

  // 
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex'
    },
  })
} 