
import type { Metadata } from "next";
export const metadata: Metadata = {
    title: {
        template: "%s | Lokalhost_io - Open Source Components library",
        default: "Lokalhost_io - Open Source Component library",
    },
};




export default async function HomeLayout({
    children,
}: {
    
    children: React.ReactNode;
}) {
    return (
        <div>
            <main className="relative w-full pt-0 md:pt-0 bg-white dark:bg-black">
                {children}
            </main>

        </div>
    );
}
