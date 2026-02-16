import CTA from "@/components/landing/CTA";
import { HeroSection } from "@/components/landing/hero";
import { FinalMainFAQ } from "@/components/FAQ/FAQ";
import ComponentsShowcase from "@/components/landing/LandingComponents/ComponentsShowcase";
import { TemplatesBlockList } from "@/components/landing/LandingComponents/ComponentsShowcase";
import { headers } from "next/headers";
interface IServiceType {
    button_name: string,
    button_link: string
}
interface IHeroSectionSevice {
    id: string | number
    sercice_name: string,
    service_disc: string,
    service_link: string,
    service_light_image: string,
    service_dark_image: string,
    service_buttons: IServiceType[]
}

const fetchHeroSectionData = async (): Promise<IHeroSectionSevice[]> => {
  try {
    const heroData = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/config/hero_section_service_config2.json`,
      { cache: "force-cache" }
    );
    if (!heroData.ok) {
      throw new Error("Failed to fetch Hero config data");
    }

    return await heroData.json();
  } catch (error) {
    console.error(error);
    return []; // ✅ ALWAYS return correct type
  }
};

//✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

export interface ITemplate {
  image: string;
  to?: string;
}



export default async function Home() {
    const heroSectionData = await fetchHeroSectionData();
    return (
        <main className="bg-white dark:bg-black/5 overflow-x-hidden">
            <div className="grid grid-rows-[auto_1fr_auto] min-h-screen px-0 lg:px-4 gap-4 sm:gap-12">
                <HeroSection heroServiceContent={heroSectionData}/>
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
