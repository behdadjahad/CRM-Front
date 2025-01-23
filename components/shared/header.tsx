import React from "react";
import ProfileDropDown from "./profile-drop-down";
import Notification from "./notification";
import Search from "./search";
import { Button } from "../ui/button";
import Image from "next/image";

export interface HeaderInterface {
  state: boolean;
  setState: (prev: any) => any;
}

export default function Header({ setState }: HeaderInterface) {
  return (
    <header className="shadow-header-bottom bg-header w-full flex flex-row items-center justify-between px-8 h-20 gap-2">
      <Button
        className="border-none p-0 lg:hidden"
        onClick={() => setState(true)}
      >
        <Image
          src={"/icons/menu.png"}
          alt="منو"
          width={1024}
          height={1024}
          className="h-10 w-10"
        />
      </Button>

      <ProfileDropDown className="hidden lg:flex" />

      <Notification unread={true} className="mr-auto lg:mr-0 lg:ml-auto" />

      <Search />
    </header>
  );
}
