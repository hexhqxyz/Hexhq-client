/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    distDir: "out",
    images: {
        loader: "custom",
        loaderFile: './imageLoader.ts',
        
    },
};

export default nextConfig;
