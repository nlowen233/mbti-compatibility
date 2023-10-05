/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    if (process.env.NEXT_PUBLIC_MAINTENANCE === 'true') {
      return [
        {
          source: '/((?!maintenance.html).*)', // Any route except /maintenance.html
          destination: '/maintenance.html', // The static HTML page for maintenance
          permanent: false,
        },
      ]
    }
    return []
  },
}

module.exports = nextConfig
