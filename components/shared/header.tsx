import React from "react";
import ProfileDropDown from "./profile-drop-down";
import Notification from "./notification";
import Search from "./search";

export default function Header() {
  return (
    <header className="shadow-header bg-header w-full flex flex-row items-center justify-between px-8 h-16">
      <div className="flex flex-row gap-2">
        <ProfileDropDown name="امیر مقدسی" avatar="/temp/avatar.png" />

        <Notification unread={true} />
      </div>

      <Search className="w-[450px] hidden lg:flex" />
    </header>
  );
}
