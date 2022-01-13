import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 *
 * @param callback this callback should be a fetch function
 * @param loadingTime the time to wait in ms
 * @returns returns useRef object and loading state
 */
const useInfiniteScroll = (
  callback: Function,
  loadingTime: number
): [React.MutableRefObject<HTMLDivElement | null>, boolean] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // for the purposes of the app this will show a loading state as we fetch api data from the callback function we pass in
  const getDataFromCallback = useCallback(() => {
    setIsLoading(true);
    setTimeout(async () => {
      await callback();
      setIsLoading(false);
    }, loadingTime);
  }, [callback, loadingTime]);

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        getDataFromCallback();
      }
    });
  };
  if (typeof window !== 'undefined' && observerRef.current == null && elementRef.current instanceof Element) {
    observerRef.current = new IntersectionObserver(intersectionCallback);
    observerRef.current.observe(elementRef.current);
  }

  // on mount this will trigger a rerender and elementRef.current will be set on the 2nd render allowing the observer to work
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return [elementRef, isLoading];
};

export default useInfiniteScroll;
