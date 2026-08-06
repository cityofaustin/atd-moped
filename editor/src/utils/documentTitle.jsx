"use client";

import { useEffect } from "react";

/**
 * Custom hook that sets the document title for the page
 */
export const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};
