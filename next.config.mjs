const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.printful.com' },
      { protocol: 'https', hostname: '*.public.printful.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};

export default nextConfig;