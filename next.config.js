/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['ar', 'en'],
    defaultLocale: 'ar',
    localeDetection: true
  },
  env: {
    API_URL: 'http://localhost:3000',
    API_IMG: 'http://localhost:3000/api/images/download'
  },
  images: {
    domains: ['', 'img.youtube.com']
  },
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false }

    return config
  }
}

module.exports = nextConfig
