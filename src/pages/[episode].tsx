import Head from 'next/head';
import {GetStaticProps, GetStaticPaths} from 'next';
import {Episode as EpisodeT, allEpisodes} from 'contentlayer/generated';
import Episode from '@/components/Episode';
import Page from '@/components/Page';
import Map from '@/components/Map';
import {useRouter} from 'next/router';

type Props = {allEpisodes: EpisodeT[]};

export default function EpisodePage(props: Props) {
  const {query} = useRouter();

  const episode = props.allEpisodes.find(
    (e) => e._raw.flattenedPath === query.episode,
  );

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

  return (
    <Page aside={<Map selectedEpisodeId={episode?._id} />}>
      <Head>
        <title>
          {(episode != null ? episode.title + ' - ' : '') + 'Luftpost Podcast'}
        </title>
      </Head>

      {episode != null ? (
        <Episode episode={episode} />
      ) : (
        props.allEpisodes.map((e) => <Episode key={e._id} episode={e} />)
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => ({
  props: {
    allEpisodes: allEpisodes,
  },
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: allEpisodes.map((e) => '/' + e._raw.flattenedPath),
  fallback: false,
});
