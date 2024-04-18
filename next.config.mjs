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
    domains: ["http://localhost:3000"],
    unoptimized: true,
  },
};

export default nextConfig;
