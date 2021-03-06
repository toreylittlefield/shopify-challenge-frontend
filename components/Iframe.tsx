import React from 'react';
import { IframeProps } from '../types/video';

const Iframe = ({ width = 504, height = 336, srcURL = '', title = '' }: IframeProps) => {
  return (
    <iframe
      className="video-iframe"
      // onLoadCapture={(onstart) => console.log({ onstart })}
      // onLoad={(onload) => console.log({ onload })}
      loading="lazy"
      frameBorder="0"
      title={title}
      allowFullScreen
      width={width}
      height={height}
      src={srcURL}
      allow="accelerometer; autoplay; clipboard-write;
  encrypted-media; gyroscope; picture-in-picture; full-screen"
    />
  );
};

export { Iframe };
