/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // hasil build = file statis di folder "out"
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
