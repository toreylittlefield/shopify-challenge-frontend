import { NasaImageObj } from './nasa-api-data';

interface Video extends NasaImageObj {
  index: number;
}

export type VideoProps = Pick<Video, 'srcURL' | 'thumbnail_url' | 'index' | 'title'>;

interface Iframe extends VideoProps {
  width: number;
  height: number;
}

export type IframeProps = Pick<Iframe, 'srcURL' | 'height' | 'width' | 'title'>;
