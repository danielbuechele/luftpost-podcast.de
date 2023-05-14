import allEpisodes from '../.contentlayer/generated/Episode/_index.json';
import RSS from 'rss';
import fs from 'fs/promises';
import {join} from 'path';
import {secondsToTime} from '../src/utils/time';

(async () => {
  const sortEpisodes = allEpisodes.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const cover = 'https://luftpost-podcast.de/cover.png';
  const db = 'Daniel Büchele';

  const feed = new RSS({
    title: 'Luftpost Podcast',
    description:
      'Luftpost bringt in unregelmäßigen Abständen Interviews mit Leuten, die spannende Orte dieser Welt besucht haben. Gemeinsam sprechen wir über Kultur, Leben, Sehenswürdigkeiten und mehr Dinge, die es auf einer Reise dort zu erkunden gilt.',
    feed_url: 'https://luftpost-podcast.de/feed/podcast',
    site_url: 'https://luftpost-podcast.de',
    image_url: cover,
    webMaster: db,
    copyright: `${new Date().getFullYear()} Daniel Büchele`,
    language: 'de-DE',
    pubDate: sortEpisodes.at(0)?.publishedAt,
    managingEditor: db,
    ttl: 60,
    custom_namespaces: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    },
    // @ts-ignore
    custom_namespaces: {spotify: 'http://www.spotify.com/ns/rss'},
    custom_elements: [
      {'spotify:countryOfOrigin': 'de at ch'},
      {'itunes:author': db},
      {'itunes:explicit': 'clean'},
      {
        'itunes:owner': [
          {'itunes:name': db},
          {'itunes:email': 'daniel@buechele.cc'},
        ],
      },
      {
        'itunes:image': {
          _attr: {
            href: cover,
          },
        },
      },
      {
        'itunes:category': [
          {
            'itunes:category': {
              _attr: {
                text: 'Society & Culture',
              },
            },
          },
          {
            _attr: {
              text: 'Places & Travel',
            },
          },
        ],
      },
    ],
  });

  for (const i of sortEpisodes) {
    feed.item({
      title: i.title.replaceAll('&', '&amp;'),
      description: i.body.html,
      url: `https://luftpost-podcast.de/${i.slug}`, // link to the item
      guid: i.guid, // optional - defaults to url
      date: i.publishedAt,
      lat: i.latitude,
      long: i.longitude,
      // @ts-ignore
      enclosure: {url: i.mediaUrl, length: i.byteSize, type: i.mimeType},
      custom_elements: [
        {'itunes:author': db},
        {
          'itunes:image': {
            _attr: {
              href: cover,
            },
          },
        },
        {'itunes:duration': secondsToTime(i.durationSeconds)},
      ],
    });
  }

  await fs.writeFile(
    join(__dirname, '..', 'public', 'feed.xml'),
    feed
      .xml({indent: '  '})
      //removing CDATA from title
      .replace(/<title><!\[CDATA\[(.+)]]><\/title>/gm, `<title>$1</title>`),
  );
})();
