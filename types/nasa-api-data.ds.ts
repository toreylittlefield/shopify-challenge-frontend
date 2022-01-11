export type EndPoints = 'https://api.nasa.gov/planetary/apod';

export interface NasaSearchParams {
  api_key: string;
  date?: Date;
  concept_tags?: boolean;
  hd?: boolean;
  count?: number;
  start_date?: Date;
  end_date?: Date;
  thumbs?: boolean;
}

export interface NasaImageObj {
  copyright: string;
  date: Date;
  explanation: string;
  hdurl: string;
  media_type: string;
  serviceVersion: string;
  title: string;
  url: string;
  thumbnail_url: string;
}
