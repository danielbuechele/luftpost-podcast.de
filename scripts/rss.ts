import RSS from 'rss';
import fs from 'fs/promises';
import {join, dirname} from 'path';
import {secondsToTime} from '../src/utils/time';
import {allEpisodes} from '../.contentlayer/generated/index.mjs';
import {fileURLToPath} from 'url';
import striptags from 'striptags';
import truncate from 'truncate';
import {decodeHTML} from 'entities';

(async () => {
  const sortEpisodes = allEpisodes.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const cover = 'https://www.luftpost-podcast.de/cover.png';
  const db = 'Daniel Büchele';
  const description =
    'Luftpost bringt in unregelmäßigen Abständen Interviews mit Leuten, die spannende Orte dieser Welt besucht haben. Gemeinsam sprechen wir über Kultur, Leben, Sehenswürdigkeiten und mehr Dinge, die es auf einer Reise dort zu erkunden gilt.';
  const webMaster = `daniel@buechele.cc (${db})`;

  const feed = new RSS({
    title: 'Luftpost Podcast',
    description,
    feed_url: 'https://www.luftpost-podcast.de/feed.xml',
    site_url: 'https://www.luftpost-podcast.de',
    image_url: cover,
    webMaster,
    copyright: `&#xA9; ${new Date().getFullYear()} ${db}`,
    language: 'de-DE',
    pubDate: sortEpisodes.at(0)?.publishedAt,
    managingEditor: webMaster,
    ttl: 60,
    custom_namespaces: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
      spotify: 'http://www.spotify.com/ns/rss',
      content: 'http://purl.org/rss/1.0/modules/content/',
    },
    custom_elements: [
      {'spotify:countryOfOrigin': 'de at ch'},
      {'itunes:author': db},
      {'itunes:explicit': 'clean'},
      {'itunes:summary': description},
      {'itunes:subtitle': 'Der Reisepodcast mit Daniel Büchele'},
      {'itunes:type': 'episodic'},
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
                text: 'Places & Travel',
              },
            },
          },
          {
            _attr: {
              text: 'Society & Culture',
            },
          },
        ],
      },
    ],
  });

  for (const i of sortEpisodes) {
    feed.item({
      title: i.title.replaceAll('&', '&amp;'),
      description: summary(
        i.body.html.replaceAll('href="/', 'href="https://www.luftpost-podcast.de/'),
        100000,
      ),
      url: `https://www.luftpost-podcast.de/${i.slug}`, // link to the item
      guid: i.guid, // optional - defaults to url
      date: i.publishedAt,
      lat: i.latitude,
      long: i.longitude,
      custom_elements: [
        {'content:encoded': {_cdata: i.body.html}},
        {'itunes:summary': summary(i.body.html, 4000)},
        {
          'itunes:subtitle': summary(i.body.html, 250).replace(
            /(\r\n|\n|\r)/gm,
            ' ',
          ),
        },
        {
          enclosure: {
            _attr: {url: i.mediaUrl, length: i.byteSize, type: i.mimeType},
          },
        },
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
    join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'feed.xml'),
    feed
      .xml({indent: '  '})
      //removing CDATA from title
      .replace(/<title><!\[CDATA\[(.+)]]><\/title>/gm, `<title>$1</title>`),
  );
})();

function summary(s: string, length: number) {
  return truncate(decodeHTML(striptags(s)), length);
}
