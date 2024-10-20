import React from "react";
import ProfileDropDown from "./profile-drop-down";

export default function Header() {
  return (
    <header className="shadow-header bg-header w-full flex flex-row-reverse items-center px-8 h-16">
      <ProfileDropDown name="امیر مقدسی" avatar="/temp/avatar.png" />
    </header>
  );
}
