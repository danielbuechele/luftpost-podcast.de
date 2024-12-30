const {withContentlayer} = require('next-contentlayer2');
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  redirects: async () => [
    {
      source: '/feed/podcast',
      destination: '/feed.xml',
      permanent: true,
    },
  ],
};

module.exports = withContentlayer(nextConfig);
