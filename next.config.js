/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
})

const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['pbs.twimg.com'],
  },
}

module.exports = withPWA(nextConfig)
