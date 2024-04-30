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
    domains: [process.env.NEXTAUTH_URL_INTERNAL],
    unoptimized: true,
  },
  env: {
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
  },
};

export default nextConfig;
