/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async redirects() {
    return [
      {
        source: '/user',
        destination: '/user/about',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
