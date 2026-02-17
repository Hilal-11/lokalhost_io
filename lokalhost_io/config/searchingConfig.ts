import { GrCubes } from "react-icons/gr";
import { MdViewQuilt } from "react-icons/md";
import { LiaIconsSolid } from "react-icons/lia";
import { TbBrandAuth0 } from "react-icons/tb";
import { LuFigma } from "react-icons/lu";
import { PiCubeDuotone } from "react-icons/pi";
import { RiTeamLine } from "react-icons/ri";
import { BsPersonWorkspace } from "react-icons/bs";
import { LuMessageCircleWarning } from "react-icons/lu";
import { LiaBlogSolid } from "react-icons/lia";
interface IMAIN_PAGE_SERCHING {
    suggesstion: string,
    suggesstion_to: string,
    Icon: React.ElementType
}

export const MAIN_PAGE_SEARCHING_CONFIG:IMAIN_PAGE_SERCHING[] = [ 
    {
        suggesstion: "Components",
        suggesstion_to: "/docs",
        Icon: GrCubes
    },
    {
        suggesstion: "Templates",
        suggesstion_to: "/templates",
        Icon: MdViewQuilt
    },
    {
        suggesstion: "Designs",
        suggesstion_to: "/designs",
        Icon: TbBrandAuth0
    },
    {
        suggesstion: "Authentication kits",
        suggesstion_to: "/authdocs",
        Icon: LiaIconsSolid
    },
    {
        suggesstion: "SASS stater kits",
        suggesstion_to: "/sass-kits",
        Icon: LuFigma
    },
    {
        suggesstion: "Mobile UI Elements",
        suggesstion_to: "/mobile-elements",
        Icon: PiCubeDuotone
    },
    {
        suggesstion: "Mobile Applications",
        suggesstion_to: "/mobile",
        Icon: PiCubeDuotone
    },
    {
        suggesstion: "Pricing",
        suggesstion_to: "/pricing",
        Icon: MdViewQuilt
    },
     {
        suggesstion: "Custom Work",
        suggesstion_to: "/custom-work",
        Icon: BsPersonWorkspace
    },
    {
        suggesstion: "Blogs",
        suggesstion_to: "/blogs",
        Icon: LiaBlogSolid
    },
     {
        suggesstion: "About Product",
        suggesstion_to: "/about",
        Icon: LuMessageCircleWarning
    },
    {
        suggesstion: "Team",
        suggesstion_to: "/team",
        Icon: RiTeamLine
    },
]