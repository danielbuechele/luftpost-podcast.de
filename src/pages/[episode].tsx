import Head from 'next/head';
import {GetStaticProps, GetStaticPaths} from 'next';
import {Episode as EpisodeT, allEpisodes} from 'contentlayer/generated';
import Episode from '@/components/Episode';
import Page from '@/components/Page';
import Map from '@/components/Map';

type Props = {episode: EpisodeT};

export default function EpisodePage(props: Props) {
  return (
    <Page aside={<Map selectedEpisodeId={props.episode._id} />}>
      <Head>
        <title>{props.episode.title + ' - Luftpost Podcast'}</title>
      </Head>
      <Episode episode={props.episode} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => ({
  props: {
    episode: allEpisodes.find(
      (e) => e._raw.flattenedPath === context.params?.episode,
    )!,
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: allEpisodes.map((e) => '/' + e._raw.flattenedPath),
  fallback: false,
});
