import Head from 'next/head';
import {GetStaticProps, GetStaticPaths} from 'next';
import {Episode, allEpisodes} from 'contentlayer/generated';

type Props = {episode: Episode};

export default function Episode(props: Props) {
  return (
    <>
      <Head>
        <title>{props.episode.title + ' - Luftpost Podcast'}</title>
      </Head>
      <Episode episode={props.episode} />
    </>
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
