import { cn } from "@/lib/utils";
import React from "react";



export interface SocialMediaInterface {
  className?: string;
  list: {
    id: number;
    label: string;
  }[];
  onSendHandler: (arg:any) => void;
}

export default function SocialMedia({ className, list ,onSendHandler}: SocialMediaInterface) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center justify-center w-full gap-x-8 gap-y-2 rounded-xl p-6 bg-card shadow-[0px_12px_24px_-4px_#919EAB1F]",
        className
      )}
    >
      <span className="text-sm">طریقه ارتباط جهت رضایت مندی:</span>

      <div className="flex items-center gap-4">
        {list.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onSendHandler(item.id)
            }}
          >
            {item.label}
            {/* <NavLink key={item.name} link={item.link}> */}
            {/* <Image
              src={item.imageSrc}
              alt={item.name}
              width={1028}
              height={1028}
              className="w-6 h-6 p-0.5 object-contain"
            /> */}
            {/* </NavLink>  */}
          </div>
        ))}
      </div>
    </div>
  );
}
