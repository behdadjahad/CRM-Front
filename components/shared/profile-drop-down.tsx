import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export interface ProfileDropDownInterface {
  name: string;
  avatar: string;
}

export default function ProfileDropDown({
  avatar,
  name,
}: ProfileDropDownInterface) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="bg-badge p-2 rounded-lg flex flex-row-reverse items-center gap-3 outline-none h-10">
          <div className="flex flex-row-reverse items-center gap-2 text-badge-foreground">
            <Image src={avatar} alt={name} width={24} height={24} />
            <span className="text-xsl">{name}</span>
          </div>

          <ChevronDown size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
