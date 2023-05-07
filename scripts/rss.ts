import {allEpisodes} from '../.contentlayer/generated';
import RSS from 'rss';
import fs from 'fs/promises';
import {join} from 'path';

(async () => {
  const desc =
    'Luftpost bringt in unregelmäßigen Abständen Interviews mit Leuten, die spannende Orte dieser Welt besucht haben. Gemeinsam sprechen wir über Kultur, Leben, Sehenswürdigkeiten und mehr Dinge, die es auf einer Reise dort zu erkunden gilt.';

  const feed = new RSS({
    title: 'Luftpost Podcast',
    description: 'description',
    feed_url: 'https://luftpost-podcast.de/feed/podcast',
    site_url: 'https://luftpost-podcast.de',
    image_url: 'https://luftpost-podcast.de/cover.png',
    webMaster: 'Daniel Büchele',
    copyright: '2013 Dylan Greene',
    language: 'de-DE',
    categories: ['Category 1', 'Category 2', 'Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    managingEditor: 'Daniel Büchele',
    ttl: 60,
    custom_namespaces: {
      itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
    },
    custom_elements: [
      {'itunes:subtitle': desc},
      {'itunes:author': 'Daniel Büchele'},
      {
        'itunes:summary': desc,
      },
      {
        'itunes:owner': [
          {'itunes:name': 'Daniel Büchele'},
          {'itunes:email': 'daniel@buechele.cc'},
        ],
      },
      {
        'itunes:image': {
          _attr: {
            href: 'https://luftpost-podcast.de/cover.png',
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

  for (const i of allEpisodes) {
    feed.item({
      title: i.title,
      description: 'use this for the content. It can include html.',
      url: `https://luftpost-podcast.de/${i._id}`, // link to the item
      guid: `https://luftpost-podcast.de/?p=${i._id}`, // optional - defaults to url
      categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4'], // optional - array of item categories
      author: 'Guest Author', // optional - defaults to feed author property
      date: i.publishedAt,
      lat: i.latitude,
      long: i.longitude,
      enclosure: {url: '...', file: 'path-to-file'}, // optional enclosure
      custom_elements: [
        {'itunes:author': 'Daniel Büchele'},
        {'itunes:subtitle': 'A short primer on table spices'},
        {
          'itunes:image': {
            _attr: {
              href: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg',
            },
          },
        },
        {'itunes:duration': '7:04'},
      ],
    });
  }

  await fs.writeFile(
    join(__dirname, '..', 'public', 'feed', 'podcast'),
    feed.xml(),
  );
})();
