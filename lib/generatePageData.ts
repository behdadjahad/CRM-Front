export function generatePageAccessData(pageCode: any) {
  console.log("input",pageCode)
  const accessData = safeLocalStorage.getItem("accessData");
  console.log(accessData)
  if (accessData) {
    const matchPage = JSON.parse(accessData)?.pages?.find(
      (item: any) => pageCode in item
    );
    return matchPage ? matchPage[pageCode] : undefined;
  } else return null;
}

// lib/storage.ts
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage:", error);
    }
  }
};

// 
export function generateFeatureAccess(features: any, code: any) {
  console.log("feature and code",features,code)
  const feature = features?.find((item: any) => item?.code == code);
  console.log("feature", feature);
  return {
    enable: feature?.enabled,
    show: feature?.show,
  };
}

  
