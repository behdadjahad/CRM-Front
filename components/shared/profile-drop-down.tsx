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
import { fetchUserData, testAction } from "@/store/user-slice";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, logOut } from "@/api/auth";
import { useRouter } from "next/navigation";
import { safeLocalStorage } from "@/lib/generatePageData";

export interface ProfileDropDownInterface {
  className?: string;
}

export default function ProfileDropDown({
  className,
}: ProfileDropDownInterface) {
  const userData = useSelector((state: any) => state.user);
  const fullState = useSelector((state: any) => state);
  console.log("🔍 Component userData:", userData);
  console.log("🔍 Full Redux state:", fullState);
  console.log("🔍 State keys:", Object.keys(fullState || {}));
  const router = useRouter();
  const dispatch = useDispatch<any>();

  useEffect(() => {
    console.log("🎯 Testing Redux store");

    // Test regular action first
    console.log("🧪 Dispatching testAction");
    dispatch(testAction());

    // Then test async thunk
    console.log("🎯 Dispatching fetchUserData");
    dispatch(fetchUserData());
  }, [dispatch]);

  const { mutate: fetchMe } = useMutation({
    mutationFn: getMe,
    onError: (response: any) => {
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
      safeLocalStorage.removeItem("token");
      safeLocalStorage.removeItem("refreshToken");
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
    const token = safeLocalStorage.getItem("token");
    const refreshToken = safeLocalStorage.getItem("refreshToken");
    if (!token && !refreshToken) {
      router.push("/login");
    }
  }, []);
  useEffect(() => {
    fetchMe();
  }, []);
  console.log(userData);
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
            alt={userData?.fullName}
            width={24}
            height={24}
            className="shadow-[0px_4px_4px_0px_#00000040] rounded-full"
          />

          <span className="text-xs">{userData?.fullName}</span>
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
