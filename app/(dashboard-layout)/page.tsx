"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/login");
  //   } else {
  //     router.push("/sale");
  //   }
  // }, []);

  return <main className="flex items-center justify-center">Dashboard</main>;
}
