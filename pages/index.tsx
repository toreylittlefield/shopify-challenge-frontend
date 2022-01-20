import type { NextPage } from 'next';
import Head from 'next/head';
import { InferGetStaticPropsType } from 'next';
import styles from '../styles/Home.module.css';
import { useState } from 'react';
import { Frame, MenuActionDescriptor, Page, PageActions, Spinner } from '@shopify/polaris';
import { NasaApiObj, UpdatedImgObj } from '../types/nasa-api-data';
import { getImageDataAPI } from './api/getnasadata';
import { updateApiDataNewProps } from '../utils';
import { Article, LoadingContent, NASALogo, RocketLogo } from '../components';
import { useFetch, useInfiniteScroll, useIndexedDB } from '../hooks';
import { FcFeedIn, FcLike } from 'react-icons/fc';

export const getStaticProps = async () => {
  // ...
  const { json = false, status, statusText } = await getImageDataAPI();

  if (!json) {
    return {
      props: { statusText, status },
    };
  }

  const data = updateApiDataNewProps(json as NasaApiObj[]);

  return {
    props: { data },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ data = [] }) => {
  const [articles, setArticles] = useState(data);

  const [isFetching, isError, getMoreImages] = useFetch(setArticles);
  const [sentinelRef, isLoading] = useInfiniteScroll(getMoreImages, 350);
  const [imagesData, { addEntry, deleteEntry, clearObjectStore }] = useIndexedDB();
  const [viewFeed, setViewFeed] = useState(true);

  const primaryAction = {
    content: 'View Feed',
    icon: FcFeedIn,
    onAction: () => setViewFeed(true),
  };
  const secondaryActions: MenuActionDescriptor[] = [
    {
      content: 'View Favorites',
      icon: FcLike,
      onAction: () => setViewFeed(false),
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Spacestagram - by Torey Littlefield</title>
        <meta name="description" content="Spacestagram - by Torey Littlefield" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Frame>
        <Page title="Spacestagram" primaryAction={primaryAction} subtitle="NASA" secondaryActions={secondaryActions}>
          <PageActions />

          <main className={styles.main}>
            <h1 className={styles.title}>Spacestagram</h1>
            <div className={styles.grid}>
              {viewFeed &&
                articles.map((imgObj, index) => {
                  return <Article key={imgObj.id} {...{ ...imgObj, setArticles, index, addEntry, deleteEntry }} />;
                })}
              {!viewFeed &&
                imagesData.map((imgObj, index) => {
                  const srcURL = imgObj.media_type === 'video' ? imgObj.srcURL : imgObj.imageBase64 || imgObj.srcURL;
                  return (
                    <Article
                      key={imgObj.id}
                      {...{
                        ...imgObj,
                        setArticles,
                        media_type: imgObj.media_type,
                        srcURL: srcURL,
                        index,
                        deleteEntry,
                        buttonType: 'Delete',
                      }}
                    />
                  );
                })}
            </div>
            {viewFeed && (isLoading || isFetching) && <LoadingContent />}
          </main>
        </Page>
      </Frame>

      <footer ref={sentinelRef} className={styles.footer}>
        <a href="https://www.github.com/toreylittlefield" target="_blank" rel="noopener noreferrer">
          API by NASA
          <span className={styles.logo}>
            <div className="logo-container">
              <NASALogo className="stack" height={88} width={88} />
              <div className="parent stack">
                <RocketLogo height={16} width={32} />
              </div>
            </div>
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
