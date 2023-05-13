import {Html, Head, Main, NextScript} from 'next/document';

export default function Document() {
  return (
    <Html lang="de">
      <Head>
        <link
          rel="apple-touch-icon"
          href="https://luftpost-podcast.de/cover.png"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Luftpost Podcast"
          href="/feed.xml"
        />
        <meta
          property="og:image"
          content="https://luftpost-podcast.de/cover.png"
        />
        <meta name="apple-itunes-app" content="app-id=409553739"></meta>
        <link
          rel="icon"
          type="image/png"
          href="https://luftpost-podcast.de/cover.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
