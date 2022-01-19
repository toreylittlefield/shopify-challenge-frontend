import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Page, Spinner } from '@shopify/polaris';
import { ImportMinor } from '@shopify/polaris-icons';
import { InferGetStaticPropsType } from 'next';
import { NasaApiObj, NasaImageObj } from '../types/nasa-api-data';
import { getImageDataAPI } from './api/getNasaData';
import { updateApiDataNewProps } from '../utils';
import { useState } from 'react';
import { Article, LoadingContent, NASALogo, RocketLogo } from '../components';
import { useFetch, useInfiniteScroll, useIndexedDB } from '../hooks';
type Props = {
  data: [] | NasaImageObj[];
};

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

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ data = [], status, statusText }) => {
  const breadcrumbs = [
    { content: 'Sample apps', url: '/sample-apps' },
    { content: 'Create React App', url: '/create-react-app' },
  ];
  const primaryAction = { content: 'New product' };
  const secondaryActions = [{ content: 'Import', icon: ImportMinor }];

  const [articles, setArticles] = useState(data);

  const [isFetching, isError, getMoreImages] = useFetch(setArticles);
  const [sentinelRef, isLoading] = useInfiniteScroll(getMoreImages, 350);
  const [imagesData, { addEntry, deleteEntry, clearObjectStore }] = useIndexedDB();

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Spacestagram- by Torey Littlefield" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page title="Polaris" breadcrumbs={breadcrumbs} primaryAction={primaryAction} secondaryActions={secondaryActions}>
        <main className={styles.main}>
          <h1 className={styles.title}>Spacestagram</h1>
          <div className={styles.grid}>
            {articles.map((imgObj, index) => {
              return <Article key={imgObj.id} {...{ ...imgObj, index }} />;
            })}
          </div>
          {(isLoading || isFetching) && <LoadingContent />}
        </main>
      </Page>

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
