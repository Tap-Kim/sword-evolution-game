/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  webpack: (config) => {
    config.externals = config.externals || [];
    config.externals.push({
      "react-three-fiber": "react-three-fiber",
      three: "three",
    });
    return config;
  },
};

module.exports = nextConfig;
