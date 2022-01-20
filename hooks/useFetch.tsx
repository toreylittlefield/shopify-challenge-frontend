import { useCallback, useState } from 'react';
import { updateApiDataNewProps } from '../utils';
import { NasaSearchParams } from '../types/nasa-api-data';

type SetStateAction<S> = S | ((prevState: S) => S);

function useFetch(
  setState: SetStateAction<(prevState?: any) => any | void> = () => {},
  url: string = '/api/getnasadata',
  params?: NasaSearchParams
): [boolean, { isError: boolean; message: string }, typeof getMoreImages] {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ isError: false, message: '' });
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const paramOptions = new URLSearchParams((params as any) || '');
      const res = await fetch(`${url}?${paramOptions.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setIsError({ isError: true, message: '' });

        return json.message;
      }
      throw new Error(res.statusText);
    } catch (error) {
      console.error(error);
      setIsError({ isError: true, message: JSON.stringify(error) });
      return [];
    }
  }, [params, url]);

  const getMoreImages = useCallback(async () => {
    setIsLoading(true);
    const nasaApiData = await fetchData();
    if (nasaApiData.length > 0) {
      const nasaImgData = updateApiDataNewProps(nasaApiData);
      setState((prev) => [...prev, ...nasaImgData]);
    }
    setIsLoading(false);
  }, [fetchData, setState]);

  return [isLoading, isError, getMoreImages];
}

export { useFetch };
