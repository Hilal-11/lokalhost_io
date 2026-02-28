import CTA from "@/components/landing/CTA";
import { HeroSection } from "@/components/landing/hero";
import { FinalMainFAQ } from "@/components/FAQ/FAQ";

export default async function Home() {
    return (
        <main className="bg-white dark:bg-black/5">
            <div className="grid grid-rows-[auto_1fr_auto] px-0 lg:px-4 gap-4 sm:gap-12 overflow-hidden">
                <HeroSection/>
            </div>
            <div className="w-full container max-w-[1580px]">
                <FinalMainFAQ />
            </div>
            <div className="pt-10 pb-5">
                <CTA/>
            </div>
        </main>
    );
}
