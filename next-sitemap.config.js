/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://transformpdfs.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      'https://transformpdfs.com/api/sitemap.xml',
    ],
  },
} 