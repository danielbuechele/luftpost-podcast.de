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
import {ReactMarkdown} from 'react-markdown/lib/react-markdown';

type Props =
  | {contentType: 'Episode'; episode: EpisodeT}
  | {contentType: 'Home'; allEpisodes: EpisodeT[]}
  | {contentType: 'Page'; page: PageT};

export default function ContentPage(props: Props) {
  if (props.contentType === 'Page') {
    return (
      <Page
        aside={<Image src={props.page.image} alt="" width={100} height={100} />}
      >
        <Head>
          <title>{props.page.title + ' - ' + 'Luftpost Podcast'}</title>
        </Head>
        <ReactMarkdown>{props.page.body.raw}</ReactMarkdown>
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
        {props.allEpisodes.map((e) => (
          <Episode key={e._id} episode={e} />
        ))}
      </Page>
    );
  }

  // const options = {
  //   root: null,
  //   rootMargin: '0px',
  //   threshold: [0.0, 0.2, 0.4, 0.6, 0.8, 1.0],
  // };
  // const intersectionCallback = function (entries) {
  //   entries.forEach((entry) => {
  //     const ratio = Math.round(100 * entry.intersectionRatio) / 100;
  //   });
  // };
  // const observer = new IntersectionObserver(intersectionCallback, options);
}

export const getStaticProps: GetStaticProps<Props, {slug: string}> = async (
  context,
) => {
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
        allEpisodes,
        contentType: 'Home',
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [...allPages, ...allEpisodes].map((e) => '/' + e.slug),
  fallback: false,
});
