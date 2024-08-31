/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: true,
    exportPathMap: () => {
        return {
            "/": { page: "/" }
        }
    },
};

export default nextConfig;
