export type EndPoints = 'https://api.nasa.gov/planetary/apod';

export interface NasaImageObj {
  copyright: string;
  date: Date;
  explanation: string;
  hdurl: string;
  media_type: string;
  serviceVersion: string;
  title: string;
  url: string;
}
