/** @type {import('next').NextConfig} */
const nextConfig = {
  // child_process: "empty",
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
    }
    return config;
  },
  images: {
    domains: [process.env.APP_URL],
    unoptimized: true,
  },
  env: {
    APP_URL: process.env.APP_URL,
  },
  output: "standalone",
};

export default nextConfig;
