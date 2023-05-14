import Head from 'next/head';
import {GetStaticProps} from 'next';
import {Episode, allEpisodes} from 'contentlayer/generated';
import Page from '@/components/Page';
import Map from '@/components/Map';
import Link from 'next/link';
import Flag from '@/components/Flag';
import styles from '@/styles/AlleEpisoden.module.css';

type Props = {
  allEpisodes: Array<
    Pick<Episode, 'slug' | 'title'> & {countryCode: null | string}
  >;
};

export default function ContentPage(props: Props) {
  return (
    <Page aside={<Map />}>
      <Head>
        <title>Alle Episoden - Luftpost Podcast</title>
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

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      allEpisodes: allEpisodes
        .sort((a, b) => (a.title > b.title ? 1 : -1))
        .map(({slug, title, countryCode = null}) => ({
          slug,
          title,
          countryCode,
        })),
    },
  };
};
