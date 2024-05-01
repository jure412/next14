/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    }
    return config;
  },
  images: {
    domains: [process.env.NEXTAUTH_URL],
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    // NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
