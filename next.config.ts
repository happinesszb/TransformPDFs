/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        //  Disable ESLint
        ignoreDuringBuilds: true,
      },
      typescript: {
        //  
        ignoreBuildErrors: true,
      },
      images: {
        domains: ['localhost'],
      },
      async rewrites() {
        return [
          {
            source: '/api/convert-to-word',
            destination: 'https://api.aspose.cloud/v3.0/words/convert/document',
          },
        ];
      },
      async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store, max-age=0',
              },
            ],
          },
        ]
      },
}

module.exports = nextConfig