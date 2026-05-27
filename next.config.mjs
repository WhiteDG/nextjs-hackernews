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
        source: "/",
        has: [
          {
            type: "query",
            key: "page",
            value: "(?<page>.*)",
          },
        ],
        destination: "/top/page/:page",
        permanent: false,
      },
      {
        source: "/:type(top|new|best|ask|show|jobs)",
        has: [
          {
            type: "query",
            key: "page",
            value: "(?<page>.+)",
          },
        ],
        destination: "/:type/page/:page",
        permanent: false,
      },
      {
        source: "/user",
        destination: "/user/about",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
