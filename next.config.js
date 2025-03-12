/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "three-stdlib", // drei 내부에서 사용하는 three-stdlib도 포함
  ],
};

module.exports = nextConfig;
