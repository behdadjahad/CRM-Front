// /** @type {import('next').NextConfig} */
// const nextConfig = {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output:'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "185.126.203.246",
        port: "3000",
        pathname: "/public/file-storage/**",
      },
    ],
  },
};

export default nextConfig;
