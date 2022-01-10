// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { NASA_API_KEY } from './utils';
import { EndPoints, NasaImageObj } from '../../types/nasa-api-data.ds';

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
    const params = new URLSearchParams({ api_key: NASA_API_KEY, count: '10' });
    var response = await fetch(`${url}?${params.toString()}`);
    if (response.ok) {
      const json: NasaImageObj[] = await response.json();
      return { status: response.status, statusText: response.statusText, json: json };
    }
    return { status: response.status, statusText: response.statusText };
  } catch (error) {
    console.error(error);
    return { status: response.status, statusText: response.statusText };
  }
}
