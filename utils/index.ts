import { nanoid } from 'nanoid';
import { NasaApiObj, NasaImageObj } from '../types/nasa-api-data';

export const shimmer = (w: string, h: string) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
  typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

export const updateApiDataNewProps = (nasaApiArray: NasaApiObj[] = []): NasaImageObj[] => {
  const updatedData = nasaApiArray.map((imgObj) => {
    const { date, ...rest } = imgObj;
    return { ...rest, earth_date: date, id: nanoid() };
  });

  return updatedData;
};

export const readBlob = (blob: Blob): Promise<{ error: string | false; result: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve({ result: reader.result as string, error: false });
    };
    reader.onerror = () => {
      reject({ error: 'error converting to blob', result: '' });
    };
  });
};

export const fetchImageBlob = async (srcURL: string) => {
  try {
    const res = await fetch(srcURL);
    if (res.ok) {
      const blob = await res.blob();
      if (blob.type.startsWith('image')) {
        return { error: false, blob };
      }
      throw new Error(JSON.stringify({ status: res.status, blobType: blob.type }));
    }
    const { status, statusText } = res;
    throw new Error(JSON.stringify({ status, statusText }));
  } catch (error) {
    console.error(error);
    return { error: true, errorReason: error };
  }
};
