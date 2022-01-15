// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { NASA_API_KEY } from '../../lib';
import { EndPoints, NasaImageObj, NasaSearchParams } from '../../types/nasa-api-data';
import { URLSearchParams } from 'url';

type Data = {
  message: string | NasaImageObj[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  try {
    const { status, statusText, json = false } = await getImageDataAPI();
    if (!json) {
      res.status(status).json({ message: statusText });
    } else {
      res.status(status).json({ message: json });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export async function getImageDataAPI() {
  try {
    const url: EndPoints = 'https://api.nasa.gov/planetary/apod';
    const paramOptions: NasaSearchParams = { api_key: NASA_API_KEY, count: 5, thumbs: true };
    const searchParams = new URLSearchParams(paramOptions as any);

    var response: Response | undefined = await fetch(`${url}?${searchParams.toString()}`);
    if (response.ok) {
      const json: NasaImageObj[] = await response.json();
      return { status: response.status, statusText: response.statusText, json: json };
    }
    throw new Error(String(response.status));
  } catch (error) {
    console.error(error);
    switch (response) {
      case undefined: {
        return { status: 502, statusText: 'Internal Server Error - Failed To Fetch' };
      }
      default: {
        return { status: response.status, statusText: response.statusText };
      }
    }
  }
}
