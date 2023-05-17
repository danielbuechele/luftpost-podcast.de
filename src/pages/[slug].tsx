import Head from 'next/head';
import {GetStaticProps, GetStaticPaths} from 'next';
import {
  Episode as EpisodeT,
  Page as PageT,
  allEpisodes,
  allPages,
} from 'contentlayer/generated';
import Episode from '@/components/Episode';
import Page from '@/components/Page';
import Map from '@/components/Map';
import Image from 'next/image';
import Body from '@/components/Body';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';
import Flag from '@/components/Flag';

type Props =
  | {contentType: 'Episode'; episode: EpisodeT}
  | {contentType: 'Home'; allEpisodes: EpisodeT[]}
  | {
      contentType: 'AllEpisodes';
      allEpisodes: Array<
        Pick<EpisodeT, 'slug' | 'title'> & {countryCode: null | string}
      >;
    }
  | {contentType: 'Page'; page: PageT};

export default function ContentPage(props: Props) {
  if (props.contentType === 'Page') {
    return (
      <Page
        aside={
          <div style={{position: 'relative', height: '100%'}}>
            <Image
              src={props.page.image}
              alt=""
              fill
              style={{objectFit: 'cover'}}
              sizes="50vw"
            />
          </div>
        }
      >
        <Head>
          <title>{props.page.title + ' - ' + 'Luftpost Podcast'}</title>
        </Head>
        <Body title={props.page.title}>{props.page.body}</Body>
      </Page>
    );
  } else if (props.contentType === 'AllEpisodes') {
    return (
      <Page aside={<Map />}>
        <Head>
          <title>Alle Episoden - Luftpost Podcast</title>
        </Head>
        <div className={styles.episodeGrid}>
          {props.allEpisodes.map((e) => (
            <Link className={styles.episode} href={e.slug} key={e.slug}>
              <Flag countryCode={e.countryCode} />
              <h2>{e.title}</h2>
            </Link>
          ))}
        </div>
      </Page>
    );
  } else if (props.contentType === 'Episode') {
    return (
      <Page aside={<Map selectedEpisodeId={props.episode._id} />}>
        <Head>
          <title>{props.episode.title + ' - ' + 'Luftpost Podcast'}</title>
        </Head>

        <Episode episode={props.episode} />
      </Page>
    );
  } else {
    return (
      <Page aside={<Map />}>
        <Head>
          <title>Luftpost Podcast</title>
          <meta
            property="og:description"
            content="Der Reisepodcast mit Daniel Büchele"
          />
        </Head>
        {props.allEpisodes.map((e) => (
          <Episode truncate key={e._id} episode={e} />
        ))}
        <div className={styles.allContainer}>
          <Link className={styles.allEpisodes} href="/alle-episoden">
            alle Episoden&hellip;
          </Link>
        </div>
      </Page>
    );
  }
}

export const getStaticProps: GetStaticProps<Props, {slug: string}> = async (
  context,
) => {
  if (context.params?.slug === 'alle-episoden') {
    return {
      props: {
        contentType: 'AllEpisodes',
        allEpisodes: allEpisodes
          .sort((a, b) => (a.title > b.title ? 1 : -1))
          .map(({slug, title, countryCode = null}) => ({
            slug,
            title,
            countryCode,
          })),
      },
    };
  }

  const page = allPages.find((p) => p.slug === context.params?.slug);

  if (page) {
    return {
      props: {
        contentType: page.type,
        page,
      },
    };
  }

  const episode = allEpisodes.find((e) => e.slug === context.params?.slug);

  if (episode) {
    return {
      props: {
        episode,
        contentType: 'Episode',
      },
    };
  } else {
    return {
      props: {
        allEpisodes: allEpisodes
          .sort(
            (a, b) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime(),
          )
          .slice(0, 20),
        contentType: 'Home',
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{slug: 'alle-episoden'}, ...allPages, ...allEpisodes].map(
    (e) => '/' + e.slug,
  ),
  fallback: false,
});
