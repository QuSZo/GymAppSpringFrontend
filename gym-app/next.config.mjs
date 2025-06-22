/** @type {import('next').NextConfig} */
const isDocker = process.env.NEXTJS_DOCKER === 'true';

const nextConfig = {
    ...(isDocker ? { output: 'standalone' } : {}),

    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            type: 'asset/resource',
        });

        return config;
    },
}

export default nextConfig;
