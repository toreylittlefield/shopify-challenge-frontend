import React, { SetStateAction } from 'react';
import { Video } from './index';
import Image from 'next/image';
import { shimmer, toBase64 } from '../utils';
import { CardButtons } from './CardButtons';
import { UpdatedImgObj } from '../types/nasa-api-data';

type PropType = UpdatedImgObj & {
  index: number;
  buttonType?: 'Like' | 'Delete';
  addEntry?: (imgObj: UpdatedImgObj) => void;
  deleteEntry?: (id: string) => void;
  setArticles: (prev?: SetStateAction<any>) => void;
};

const Article = ({
  copyright = '',
  earth_date = new Date().toLocaleDateString('en'),
  explanation = '',
  title = '',
  srcURL = 'https://www.nasa.gov/sites/default/files/thumbnails/image/nasa-logo-web-rgb.png',
  thumbnail_url = '',
  id = '',
  index = 2,
  ...rest
}: PropType) => {
  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer('336', '504'))}`;

  return (
    <article className="article-container">
      <figure>
        {rest.media_type === 'video' ? (
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
          {title} ::::
          {earth_date}
        </figcaption>
        <p>{explanation}</p>
        <sub>{copyright}</sub>
        <CardButtons
          id={id}
          title={title}
          srcURL={srcURL}
          {...{ ...rest, setArticles: rest.setArticles, earth_date, copyright, explanation, thumbnail_url }}
        />
      </figure>
    </article>
  );
};

export { Article };
