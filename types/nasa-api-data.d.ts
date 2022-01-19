export type EndPoints = 'https://api.nasa.gov/planetary/apod';

export interface NasaSearchParams {
  api_key?: string;
  date?: Date;
  concept_tags?: boolean;
  hd?: boolean;
  count?: number;
  start_date?: Date;
  end_date?: Date;
  thumbs?: boolean;
}

export interface NasaApiObj {
  copyright: string;
  date: Date;
  explanation: string;
  hdurl: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
  thumbnail_url: string;
}

interface UpdatedImgObj extends Omit<NasaApiObj, 'date' | 'url'> {
  id: string;
  earth_date: Date;
  liked: boolean;
  imageBase64: string | undefined;
  srcURL: string | URL;
  liked: boolean;
}

export type NasaImageObj = Omit<UpdatedImgOb, 'date'>;
