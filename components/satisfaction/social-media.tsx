import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import { config } from "@/config/config";
export interface SocialMediaInterface {
  className?: string;
  list: {
    id: number;
    label: string;
    image: string;
  }[];
  // onSendHandler: (arg: any) => void;
  form: any;
}

export default function SocialMedia({
  className,
  list,
  //onSendHandler,
  form,
}: SocialMediaInterface) {
  const staticUrl = `${config.ServerAddress}/public/`;
  
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
              // onSendHandler(item.id)
              form.setFieldValue("callDeviceId", item.id);
            }}
            className="cursor-pointer"
          >
            {/* {item.label} */}
            {/* <NavLink key={item.name} link={item.link}> */}
           { item?.image && <Image
              src={staticUrl + item?.image}
              alt={item?.label}
              width={1028}
              height={1028}
              className="w-6 h-6 p-0.5 object-contain"
            />}
            {/* </NavLink>  */}
          </div>
        ))}
      </div>
    </div>
  );
}
