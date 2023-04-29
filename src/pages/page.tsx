import Head from 'next/head';
import {GetStaticProps, GetStaticPaths} from 'next';
import Page from '@/components/Page';
import {useRouter} from 'next/router';

type Props = {};

export default function PagePage(props: Props) {
  const {query} = useRouter();

  return (
    <Page aside={null}>
      <Head>
        <title>{'a - ' + 'Luftpost Podcast'}</title>
      </Head>
      page
    </Page>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => ({
  props: {},
});

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ['/mitmachen', '/about', 'abonnieren'],
  fallback: false,
});
