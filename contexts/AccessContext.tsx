"use client";

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCurrentPageCode } from '@/store/access-slice';

interface PageAccess {
  url: string;
  code: string;
  show: boolean;
  title: string;
  pageId: number;
  enabled: boolean;
  features: string[];
}

interface AccessJson {
  pages: Record<string, PageAccess>[];
}

interface AccessContextType {
  // Permission checking functions
  hasPageAccess: (pageCode: string) => boolean;
  hasFeatureAccess: (pageCode: string, feature: string) => boolean;
  getPageFeatures: (pageCode: string) => string[];
  isPageEnabled: (pageCode: string) => boolean;
  isPageVisible: (pageCode: string) => boolean;
  
  // Current page management
  setCurrentPage: (pageCode: string) => void;
  currentPageCode: string;
  
  // Access data
  accessJson: AccessJson | null;
  hash: string;
  isLoading: boolean;
  
  // Helper functions
  getAllowedPages: () => PageAccess[];
  getVisiblePages: () => PageAccess[];
}

const AccessContext = createContext<AccessContextType | undefined>(undefined);

interface AccessProviderProps {
  children: ReactNode;
}

export function AccessProvider({ children }: AccessProviderProps) {
  const dispatch = useDispatch();
  const { accessJson, currentPageCode, hash, isLoading } = useSelector(
    (state: RootState) => state.access
  );

  // Memoized permission checking functions
  const contextValue = useMemo(() => {
    // Find page by code
    const findPage = (pageCode: string): PageAccess | null => {
      if (!accessJson?.pages) return null;
      
      for (const pageObj of accessJson.pages) {
        if (pageObj[pageCode]) {
          return pageObj[pageCode];
        }
      }
      return null;
    };

    // Check if user has access to a page
    const hasPageAccess = (pageCode: string): boolean => {
      const page = findPage(pageCode);
      return page ? page.enabled : false;
    };

    // Check if user has access to a specific feature on a page
    const hasFeatureAccess = (pageCode: string, feature: string): boolean => {
      const page = findPage(pageCode);
      if (!page || !page.enabled) return false;
      return page.features.includes(feature);
    };

    // Get all features for a page
    const getPageFeatures = (pageCode: string): string[] => {
      const page = findPage(pageCode);
      return page ? page.features : [];
    };

    // Check if page is enabled
    const isPageEnabled = (pageCode: string): boolean => {
      const page = findPage(pageCode);
      return page ? page.enabled : false;
    };

    // Check if page should be visible in navigation
    const isPageVisible = (pageCode: string): boolean => {
      const page = findPage(pageCode);
      return page ? page.show : false;
    };

    // Get all pages user has access to
    const getAllowedPages = (): PageAccess[] => {
      if (!accessJson?.pages) return [];
      
      const allowedPages: PageAccess[] = [];
      accessJson.pages.forEach(pageObj => {
        Object.values(pageObj).forEach(page => {
          if (page.enabled) {
            allowedPages.push(page);
          }
        });
      });
      return allowedPages;
    };

    // Get all pages that should be visible in navigation
    const getVisiblePages = (): PageAccess[] => {
      if (!accessJson?.pages) return [];
      
      const visiblePages: PageAccess[] = [];
      accessJson.pages.forEach(pageObj => {
        Object.values(pageObj).forEach(page => {
          if (page.show) {
            visiblePages.push(page);
          }
        });
      });
      return visiblePages;
    };

    // Set current page code
    const setCurrentPage = (pageCode: string) => {
      dispatch(setCurrentPageCode(pageCode));
    };

    return {
      hasPageAccess,
      hasFeatureAccess,
      getPageFeatures,
      isPageEnabled,
      isPageVisible,
      setCurrentPage,
      currentPageCode,
      accessJson,
      hash,
      isLoading,
      getAllowedPages,
      getVisiblePages,
    };
  }, [accessJson, currentPageCode, hash, isLoading, dispatch]);

  return (
    <AccessContext.Provider value={contextValue}>
      {children}
    </AccessContext.Provider>
  );
}

// Custom hook to use access context
export function useAccessContext() {
  const context = useContext(AccessContext);
  if (context === undefined) {
    throw new Error('useAccessContext must be used within an AccessProvider');
  }
  return context;
}