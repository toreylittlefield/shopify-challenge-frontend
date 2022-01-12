import { useRef, useState, useCallback, useEffect } from 'react';

const useInfiniteScroll = (callback: Function): [React.MutableRefObject<HTMLDivElement | null>, any[], boolean] => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getDataFromCallback = useCallback(() => {
    setLoading(true);
    setTimeout(async () => {
      const data = await callback();
      setData((prev) => [...prev, data]);
      setLoading(false);
    }, 600);
  }, [callback]);

  const intersectionCallback: IntersectionObserverCallback = (entries) => {
    if (entries.length === 1) {
      const [entry] = entries;
      if (entry.isIntersecting) {
        getDataFromCallback();
      }
    }
  };
  if (typeof window !== 'undefined' && observerRef.current == null && elementRef.current instanceof Element) {
    observerRef.current = new IntersectionObserver(intersectionCallback);
    observerRef.current.observe(elementRef.current);
  }

  useEffect(() => {
    getDataFromCallback();
  }, [getDataFromCallback]);

  return [elementRef, data, loading];
};

export default useInfiniteScroll;
