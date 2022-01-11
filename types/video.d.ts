import { NasaImageObj } from './nasa-api-data';

interface Video extends NasaImageObj {
  index: number;
}

export type VideoProps = Pick<Video, 'url' | 'thumbnail_url' | 'index' | 'title'>;

interface Iframe extends VideoProps {
  width: number;
  height: number;
}

export type IframeProps = Pick<Iframe, 'url' | 'height' | 'width' | 'title'>;
