import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { PiTerminalFill } from "react-icons/pi";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <div className=" flex items-center">
        <PiTerminalFill className="mr-2 h-8 w-8" />
        <span className="hidden md:inline-flex items-center text-lg font-bold tracking-tight text-black dark:text-white">
          Localhost.io
        </span>
      </div>
    ),
  },
  links: [
    {
      text: "Templates",
      url: "/templates",
    },
    {
      text: "Designs",
      url: "/patterns",
    },
    {
      text: "Pricing",
      url: "/pricing",
    },
    {
      type: "custom",
      children: "",
    },
  ],
};


export const baseOptions2: BaseLayoutProps = {
  nav: {
    title: (
      <div className="flex items-center">
        <PiTerminalFill className="mr-2 h-8 w-8" />
        <span className="hidden md:inline-flex items-center text-lg font-bold tracking-tight text-black dark:text-white">
          Localhost.io
        </span>
      </div>
    ),
  },
};
