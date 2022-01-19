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
  srcURL = 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png',
  thumbnail_url = '',
  id = '',
  index = 2,
  ...rest
}) => {
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer('336', '504'))}`;
  const { media_type, addEntry, deleteEntry } = rest;
  console.log([rest]);
  return (
    <article className="article-container">
      <figure>
        {media_type === 'video' ? (
          <Video key={id} {...{ title, srcURL, index, thumbnail_url }} />
        ) : (
          <Image
            priority={index === 0 || index === 1}
            src={srcURL}
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
        <CardButtons
          id={id}
          title={title}
          srcURL={srcURL}
          addEntry={addEntry}
          deleteEntry={deleteEntry}
          {...{ ...rest, copyright, explanation, thumbnail_url }}
        />
      </figure>
    </article>
  );
};

export { Article };
