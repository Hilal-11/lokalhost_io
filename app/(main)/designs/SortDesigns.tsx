import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsListUl, BsPhoneFlip } from "react-icons/bs";
import { CgDesktop } from "react-icons/cg";

export function SortDesigns() {
  return (
    <Select>
      <SelectTrigger className="w-auto font-sans font-medium lk-btn-secondary transition-[filter,box-shadow,transform]">
        <SelectValue placeholder="Sort" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="font-sans font-medium">Sort</SelectLabel>
          <SelectItem value="All">
            <span className="flex items-center gap-2"><BsListUl />All</span>
          </SelectItem>
          <SelectItem value="Figma Kits for Mobile Apps">
            <span className="flex items-center gap-2"><BsPhoneFlip />Figma Kits for Mobile Apps</span>
          </SelectItem>
          <SelectItem value="Figma Kits for Web">
            <span className="flex items-center gap-2"><CgDesktop />Figma Kits for Web</span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
