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
import Article from '../components/Article';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { useCallback, useState } from 'react';

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

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/getNasaData');
      if (res.ok) {
        const json = await res.json();
        console.log({ json });
        return json.message;
      }
      throw new Error(res.statusText);
    } catch (error) {
      console.error(error);
      return [];
    }
  }, []);

  const getMoreImages = useCallback(async () => {
    const nasaApiData = await fetchData();
    if (nasaApiData.length > 0) {
      const nasaImgData = updateApiDataNewProps(nasaApiData);
      setArticles((prev) => [...prev, ...nasaImgData]);
    }
  }, [fetchData]);

  const [sentinelRef, isLoading] = useInfiniteScroll(getMoreImages, 350);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page title="Polaris" breadcrumbs={breadcrumbs} primaryAction={primaryAction} secondaryActions={secondaryActions}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>
          <div className={styles.grid}>
            {articles.map((imgObj, index) => {
              return <Article key={imgObj.id} {...{ ...imgObj, index }} />;
            })}
          </div>
          {isLoading && <Spinner size="large" />}
        </main>
      </Page>

      <footer ref={sentinelRef} className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
