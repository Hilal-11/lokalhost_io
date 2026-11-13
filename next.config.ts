import { withNextVideo } from "next-video/process";
import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

const nextConfig = {
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    outputFileTracingIncludes: {
        "/**": ["components/lokalhost_io/**/*"],
    },
    // Legacy /mobile links used on the landing page → new /mobile sections.
    async redirects() {
        return [
            { source: "/mobile/apps", destination: "/mobile/screens", permanent: false },
            { source: "/mobile/ui-blocks", destination: "/mobile/blocks", permanent: false },
            { source: "/mobile/core-ui-rn", destination: "/mobile/components", permanent: false },
            { source: "/mobile/flutter-essentials", destination: "/mobile/components", permanent: false },
            { source: "/mobile/onboarding-rn", destination: "/mobile/screens/onboarding", permanent: false },
            { source: "/mobile/figma", destination: "/mobile", permanent: false },
        ];
    },
    async headers() {
        return [
            {
                source: "/r/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                hostname: "*",
            },
        ],
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
      },
};

export default withNextVideo(withMDX(nextConfig));