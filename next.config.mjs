/** @type {import('next').NextConfig} */
const nextConfig = {
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
