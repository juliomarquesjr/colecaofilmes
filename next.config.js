/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'br.web.img3.acsta.net'
      },
      {
        protocol: 'https',
        hostname: 'br.web.img2.acsta.net'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org'
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com'
      },
      {
        protocol: 'https',
        hostname: 'www.themoviedb.org'
      },
      {
        protocol: 'https',
        hostname: 'www.imdb.com'
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org'
      }
    ]
  }
}

module.exports = nextConfig 