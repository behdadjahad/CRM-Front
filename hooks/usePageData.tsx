import { pagesData } from "@/constants/pages-data";
import { generatePageAccessData } from "@/lib/generatePageData";
import { usePathname } from "next/navigation";

import { useMemo } from "react";

export function usePageData() {
const pathname = usePathname();

  const pageData = useMemo(() => {
    const pageCode = pagesData?.find((item) => item.url === pathname)?.code;
    if (!pageCode) return null;
    return generatePageAccessData(pageCode);
  }, [pathname, pagesData]);

  return pageData?.features;
}
