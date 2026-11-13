import { Dock, DockIcon } from "@/components/ui/dock"
export type IconProps = React.HTMLAttributes<SVGElement>
import {
  SiGithub,
  SiInstagram,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { RiTwitterXLine } from "react-icons/ri";
import { CiGlobe } from "react-icons/ci";
export default function SocialDock() {
  return (
    <div className="relative">
      <Dock iconMagnification={60} iconDistance={100}>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <SiGithub size={18}/>
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <FaLinkedin size={18}/>
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <SiInstagram size={18}/>
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <CiGlobe size={18}/>
        </DockIcon>
        <DockIcon className="bg-black/10 dark:bg-white/10">
          <RiTwitterXLine size={18}/>
        </DockIcon>
      </Dock>
    </div>
  )
}