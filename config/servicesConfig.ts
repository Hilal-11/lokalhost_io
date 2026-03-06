import { GrCubes } from "react-icons/gr";
import { IconType } from "react-icons";
import { MdViewQuilt } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { LiaIconsSolid } from "react-icons/lia";
import { TbBrandAuth0 } from "react-icons/tb";
import { LuFigma } from "react-icons/lu";
import { TbBackground } from "react-icons/tb";
import { PiCubeDuotone } from "react-icons/pi";
import { RiTeamFill } from "react-icons/ri";
interface Services {
    id: string | number
    service: string
    about: string
    icon: IconType,
    link: string

}
export const services: Services[]  = [
   {
    id: 1,
    service: "Components",
    about: "Plug-and-play components for faster, cleaner development.",
    icon: GrCubes,
    link: "/docs"
  },
  {
    id: 2,
    service: "Web Templates",
    about: "Production-ready templates with modern, top-tier code.",
    icon: MdViewQuilt,
    link: "/templates"
  },
  {
    id: 3,
    service: "Application Templates",
    about: "Full-scale app starters built with industry best practices.",
    icon: IoPhonePortraitOutline,
    link: "/mobile"
  },
  {
    id: 7,
    service: "Backgrounds",
    about: "Modern patterns and sections, ready to plug in.",
    icon: TbBackground,
    link: "/backgrounds"
  },
  {
    id: 9,
    service: "Figma Kits",
    about: "Complete design systems for fast UI/UX creation.",
    icon: LuFigma,
    link: "/designs"
  },
  {
    id: 4,
    service: "Mobile UI Elements",
    about: "Beautiful, reusable UI components for mobile apps.",
    icon: PiCubeDuotone,
    link: "/mobile"
  },
  {
    id: 5,
    service: "Authentication Kits",
    about: "JWT, OAuth, and social login solutions, ready instantly.",
    icon: TbBrandAuth0,
    link: "/authdocs"
  },
  {
    id: 6,
    service: "SASS Starter Kits",
    about: "Complete backend, APIs, and scalable architecture included.",
    icon: LiaIconsSolid,
    link: "/"
  },
  {
    id: 11,
    service: "Custom Request",
    about: "Got a unique idea? Let's build it together.",
    icon: RiTeamFill,
    link: "/custom-work"
  }
];
