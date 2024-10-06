
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "uploadthing.com",
                protocol: "https"
            },
            {
                hostname: "utfs.io",
                protocol: "https"
            }
        ]
    },
    reactStrictMode: false
};

export default nextConfig;
