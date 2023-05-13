import Head from 'next/head';
import {GetStaticProps} from 'next';
import {allEpisodes} from 'contentlayer/generated';
import Page from '@/components/Page';
import Map from '@/components/Map';
import Link from 'next/link';
import Flag from '@/components/Flag';
import styles from '@/styles/AlleEpisoden.module.css';

type Props = {
  allEpisodes: Array<{slug: string; title: string; countryCode: string}>;
};

export default function ContentPage(props: Props) {
  return (
    <Page aside={<Map />}>
      <Head>
        <title>Luftpost Podcast</title>
        <meta
          property="og:description"
          content="Der Reisepodcast mit Daniel Büchele"
        />
      </Head>
      <div className={styles.container}>
        {props.allEpisodes.map((e) => (
          <Link className={styles.episode} href={e.slug} key={e.slug}>
            <Flag countryCode={e.countryCode} />
            <h2>{e.title}</h2>
          </Link>
        ))}
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props, {slug: string}> = async (
  context,
) => {
  return {
    props: {
      allEpisodes: allEpisodes
        .sort((a, b) => (a.title > b.title ? 1 : -1))
        .map(({slug, title, countryCode}) => ({slug, title, countryCode})),
    },
  };
};
