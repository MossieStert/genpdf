/**
 * Google Analytics Utility Service
 * Safely wraps gtag calls to prevent errors if the script is missing.
 */

// Define global gtag function type
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

/**
 * Log a page view event.
 * @param pagePath - The path of the page (e.g., '/', '/tool/merge-pdf')
 * @param pageTitle - The title of the page
 */
export const logPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_path: pagePath,
    });
  } else {
    // Fallback for development or when GA is blocked
    console.debug('[Analytics] Page View:', pagePath, pageTitle);
  }
};

/**
 * Log a custom event.
 * @param eventName - Name of the event (e.g., 'select_tool', 'conversion_success')
 * @param params - Optional parameters for the event
 */
export const logEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    console.debug('[Analytics] Event:', eventName, params);
  }
};
