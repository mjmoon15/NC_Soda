/** @type {import('next').NextConfig} */
const nextConfig = {
  // This app is a rep/buyer portal only — the public storefront lives at
  // newcreationsoda.com (Shopify). Anything that used to be public here
  // (home, catalog, about, videos) now sends visitors to sign-in instead.
  async redirects() {
    return [
      { source: "/", destination: "/login", permanent: false },
      { source: "/products", destination: "/login", permanent: false },
      { source: "/products/:slug*", destination: "/login", permanent: false },
      { source: "/about", destination: "/login", permanent: false },
      { source: "/videos", destination: "/login", permanent: false },
    ];
  },
  // Allow the dev server + Server Actions to accept requests proxied through
  // an ngrok tunnel (for sharing the POC). Wildcards survive ngrok restarts.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.app"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.ngrok-free.app", "*.ngrok.app"],
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
