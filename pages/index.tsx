import type { NextPage } from 'next';
import Head from 'next/head';
import { InferGetStaticPropsType } from 'next';
import styles from '../styles/Home.module.css';
import { Fragment, useState } from 'react';
import { Frame, MenuActionDescriptor, Page, PageActions } from '@shopify/polaris';
import { NasaApiObj } from '../types/nasa-api-data';
import { getImageDataAPI } from './api/getnasadata';
import { updateApiDataNewProps } from '../utils';
import { Article, LoadingContent, NASALogo, RocketLogo } from '../components';
import { useFetch, useInfiniteScroll, useIndexedDB } from '../hooks';
import { FcFeedIn, FcLike } from 'react-icons/fc';
import { RiDeleteBin4Line, RiGithubLine } from 'react-icons/ri';
import { FaShopify } from 'react-icons/fa';

export const getStaticProps = async () => {
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

  const DeleteAllIcon = <RiDeleteBin4Line fillOpacity={100} color="white" />;

  const AnimatedLogo = (
    <Fragment>
      <h1 className={styles.title}>Spacestagram</h1>

      <div className="logo-container">
        <NASALogo className="stack" height={88} width={88} />
        <div className="parent stack">
          <RocketLogo height={16} width={32} />
        </div>
      </div>
    </Fragment>
  );

  const RepoLink = (
    <a href="https://github.com/toreylittlefield/shopify-challenge-frontend/" target="_blank" rel="noopener noreferrer">
      <span className={styles.logo}>Link To The {<RiGithubLine />}</span>
    </a>
  );

  const SubTitle = (
    <Fragment>
      <h2>
        <FaShopify color="green" /> Shopify Internship Frontend Challenge 2022
      </h2>
    </Fragment>
  );

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
        <Page
          fullWidth
          title={RepoLink as any}
          primaryAction={primaryAction}
          subtitle={SubTitle as any}
          secondaryActions={secondaryActions}
          additionalNavigation={AnimatedLogo}
        >
          <main className={styles.main}>
            <div className={styles.grid}>
              {viewFeed &&
                articles.map((imgObj, index) => {
                  return <Article key={imgObj.id} {...{ ...imgObj, setArticles, index, addEntry, deleteEntry }} />;
                })}
              {!viewFeed && (
                <Fragment>
                  <PageActions
                    secondaryActions={[
                      {
                        content: 'Remove All Favorites',
                        onAction: () => clearObjectStore(),
                        disabled: imagesData.length === 0,
                        destructive: true,
                        icon: DeleteAllIcon as any,
                      },
                    ]}
                  />
                  {imagesData.map((imgObj, index) => {
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
                </Fragment>
              )}
            </div>
            {viewFeed && (isLoading || isFetching) && <LoadingContent />}
          </main>
        </Page>
      </Frame>

      <footer ref={sentinelRef} className={styles.footer}>
        <div className="logo-container">
          <NASALogo className="stack" height={88} width={88} />
          <div className="parent stack">
            <RocketLogo height={16} width={32} />
          </div>
        </div>
        <a
          href="https://github.com/toreylittlefield/shopify-challenge-frontend/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>Link To The {<RiGithubLine />}</span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
