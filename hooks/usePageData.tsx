import { pagesData } from "@/constants/pages-data";
import { generatePageAccessData } from "@/lib/generatePageData";
import { setCurrentPageCode } from "@/store/access-slice";
import { usePathname } from "next/navigation";

import { useMemo } from "react";
import { useDispatch } from "react-redux";

export function usePageData() {
const pathname = usePathname();
console.log("path",pathname)
const dispatch=useDispatch()
  const pageData = useMemo(() => {
    const pageCode = pagesData?.find((item) => item.url === pathname)?.code;
    dispatch(setCurrentPageCode(pageCode as string));
    if (!pageCode) return null;
    return generatePageAccessData(pageCode);
 
  }, [pathname, pagesData]);

  return pageData?.features;
}
