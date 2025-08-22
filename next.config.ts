import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable strict mode in development to prevent double rendering
  reactStrictMode: process.env.NODE_ENV === 'production',

  // Enable SWC minification for better performance
  swcMinify: true,

  // Configure experimental features
  experimental: {
    // Enable app directory
    appDir: true,
  },

  // Simplified webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Essential fallbacks only
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      // Essential external packages only
      config.externals = config.externals || [];
      config.externals.push({
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        '@genkit-ai/googleai': 'commonjs @genkit-ai/googleai',
        '@genkit-ai/firebase': 'commonjs @genkit-ai/firebase',
        '@genkit-ai/next': 'commonjs @genkit-ai/next',
        genkit: 'commonjs genkit',
      });
    }

    return config;
  },

  // Server external packages configuration
  experimental: {
    serverComponentsExternalPackages: [
      '@genkit-ai/core',
      '@genkit-ai/googleai',
      '@genkit-ai/firebase',
      '@genkit-ai/next',
      'genkit',
      '@opentelemetry/sdk-node',
      '@opentelemetry/exporter-jaeger',
      'handlebars',
      'dotprompt',
    ],
  },

  // Environment variables - use proper environment variables only
  env: {
    // No hardcoded values - use environment variables instead
  },

  // Images configuration
  images: {
    domains: ['images.unsplash.com', 'i.pravatar.cc', 'placehold.co'],
  },
};

export default nextConfig;