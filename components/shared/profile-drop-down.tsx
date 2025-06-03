"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetchUserData } from "@/store/user-slice";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, logOut } from "@/api/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
export interface ProfileDropDownInterface {
  className?: string;
}

export default function ProfileDropDown({
  className,
}: ProfileDropDownInterface) {
  const userData = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserData() as any);
  }, [userData, dispatch]);

  const { mutate: fetchMe } = useMutation({
    mutationFn: getMe,
    onError: (response: any) => {
      console.log(38, response);
      if (response.status === 403) {
        router.push("/login");
      }
    },
  });

  const { mutate: logOutHandler } = useMutation({
    mutationFn: () => {
      return logOut();
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
      // Cookies.remove('accessToken', { path: '/' });
      // Cookies.remove('refreshToken', { path: '/' });
    },
  });
  // const { data: userResponse } = useQuery({
  //   queryKey: ["userResponse"],
  //   queryFn: () => getMe(),
  // });
  useEffect(() => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (!token && !refreshToken) {
      router.push("/login");
    }
  }, []);
  // useEffect(() => {
  //   fetchMe();
  // }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "bg-badge p-2 rounded-lg flex flex-row items-center gap-3 outline-none h-10",
          className
        )}
      >
        <div className="flex flex-row items-center gap-2 text-badge-foreground">
          <Image
            src={"/temp/avatar.png"}
            alt={userData.fullName}
            width={24}
            height={24}
            className="shadow-[0px_4px_4px_0px_#00000040] rounded-full"
          />

          <span className="text-xs">{userData.fullName}</span>
        </div>

        <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <Button
          className="text-center text-badge-foreground text-xs outline-none w-full border-none"
          onClick={() => {
            logOutHandler();
          }}
        >
          خروج
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
