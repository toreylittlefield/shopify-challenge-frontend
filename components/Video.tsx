import React, { useState, Fragment } from 'react';
import Image from 'next/image';
import { VideoProps } from '../types/video';
import { toBase64, shimmer } from '../utils';
import { Iframe } from './index';

const Video = ({
  srcURL = '',
  thumbnail_url = 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png',
  title = '',
  index = 2,
}: VideoProps) => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <Fragment key={srcURL}>
      <h2>Video: {title}</h2>
      {showVideo === false && (
        <Image
          className="video-thumbnail"
          priority={index === 0 || index === 1}
          src={thumbnail_url}
          alt={title}
          height={336}
          width={504}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer('336', '504'))}`}
          onClick={() => setShowVideo(true)}
          onLoadingComplete={() => setShowVideo(true)}
        />
      )}
      {showVideo === true && <Iframe height={336} width={504} title={title} srcURL={srcURL} />}
    </Fragment>
  );
};

export { Video };
