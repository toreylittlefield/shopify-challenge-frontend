import React from 'react';
import { Video } from './index';
import Image from 'next/image';
import { shimmer, toBase64 } from '../utils';
import { CardButtons } from './CardButtons';

const Article = ({
  copyright = '',
  date = new Date(),
  explanation = '',
  title = '',
  url = 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png',
  media_type = '',
  thumbnail_url = '',
  id = '',
  addEntry = (id: string) => {},
  index = 2,
}) => {
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer('336', '504'))}`;

  return (
    <article className="article-container">
      <figure>
        {media_type === 'video' ? (
          <Video key={url} {...{ title, url, index, thumbnail_url }} />
        ) : (
          <Image
            priority={index === 0 || index === 1}
            src={url}
            alt={title}
            height={336}
            width={504}
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
        )}
        <figcaption>
          {title} :::: {date.toLocaleDateString('en', { dateStyle: 'medium' })}
        </figcaption>
        <p>{explanation}</p>
        <sub>{copyright}</sub>
        <CardButtons id={id} title={title} imageSrc={url} addEntry={addEntry} />
      </figure>
    </article>
  );
};

export { Article };
