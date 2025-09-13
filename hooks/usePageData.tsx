import { pagesData } from "@/constants/pages-data";
import { generatePageAccessData } from "@/lib/generatePageData";
import { matchPath } from "@/lib/match-path";
import { setCurrentPageCode } from "@/store/access-slice";
import { usePathname } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export function usePageData() {
  const pathname = usePathname();
  const dispatch = useDispatch()
  console.log("path", pathname)

  const [storageVersion, setStorageVersion] = useState(0);

  const pageData = useMemo(() => {
    // instead of strict equality, use matchPath
    const pageItem = pagesData.find((item) => matchPath(item.url, pathname));
    const pageCode = pageItem?.code;

    dispatch(setCurrentPageCode(pageCode || ""));
    console.log("code", pageCode)
    if (!pageCode) return null;
    return generatePageAccessData(pageCode);
  }, [pathname,storageVersion]);

  //  const pageItem = pagesData.find((item) => matchPath(item.url, pathname));


  //     const pageCode = pagesData?.find((item) => item.url === pathname)?.code;
  //     console.log("age",pageCode)
  //     dispatch(setCurrentPageCode(pageCode as string));
  //     if (!pageCode) return null;
  //     return generatePageAccessData(pageCode);

  //   }, [pathname, pagesData]);
  console.log(pageData, "---------------")
  return pageData?.features;
}
