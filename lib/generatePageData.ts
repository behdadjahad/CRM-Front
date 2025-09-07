export function generatePageAccessData(pageCode: any) {

const accessData = safeLocalStorage.getItem("accessData");
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
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }
};

// 
export function generateFeatureAccess(features: any, code: string) {
  const feature = features?.find((item: any) => item?.code === code);
  return {
    enable: feature?.enable,
    show: feature?.show,
  };
}