import {parseStringPromise} from 'xml2js';
import fs from 'fs/promises';
import {join} from 'path';

const file =
  '/Users/danielbuechele/Downloads/luftpostpodcast.WordPress.2023-04-25.xml';

type WPItem = {
  title: string;
  pubDate: string;
  link: `https://luftpost-podcast.de/${string}`;
  description: string;
  ['wp:post_id']: string;
  'content:encoded': string;
  'wp:postmeta': [
    {
      'wp:meta_key': 'geolocation';
      'wp:meta_value': `${number},${number}`;
    },
    {
      'wp:meta_key': 'guest';
      'wp:meta_value': string;
    },
    {
      'wp:meta_key': 'countrycode';
      'wp:meta_value': string;
    },
    {
      'wp:meta_key': 'enclosure';
      'wp:meta_value': `${string}\r\n${number}\r\n${string}\r\n${string}`;
    },
  ];
};

(async () => {
  const xmlString = await fs.readFile(file);
  const data = await parseStringPromise(xmlString, {
    trim: true,
    explicitArray: false,
  });

  const items: WPItem[] = data.rss.channel.item;

  console.log(items.at(0)?.['wp:postmeta']);

  for (const i of items) {
    const [latitude, longitude] =
      getMetaField(i, 'geolocation')?.split(',') ?? [];

    const [mediaUrl, byteSize, mimeType, meta] =
      getMetaField(i, 'enclosure')?.split('\r\n') ?? [];

    const guest = getMetaField(i, 'guest');

    await fs.writeFile(
      join(__dirname, '..', 'episodes', `${i['wp:post_id']}.md`),
      `---
title: ${i.title}
publishedAt: 2023-04-24
guest: ${guest}
countryCode: ${getMetaField(i, 'countrycode')}
latitude: ${latitude}
longitude: ${longitude}
durationSeconds: 1354
byteSize: ${byteSize} 
mediaUrl: ${mediaUrl}
mimeType: ${mimeType}
---

2013 gab es schonmal eine Episode zu Istanbul und 2014 habe ich auch schonmal mit Moritz gesprochen. Damals über die Malediven. Moritz lebt mittlerweile in Istanbul und wir dachten es wäre ein guter Zeitpunkt um seine Perspektive zu bekommen, denn diese ist auch immer etwas anders als die touristische Wahrnehmung eines Landes. Moritz lebt und arbeitet auf der asiatischen Seite der Metropole, erzählt aber auch über seine Reisen durch die Türkei und versucht mir sogar etwas die Sprache bei zubringen.
`,
    );
  }
})();

function getMetaField(
  item: WPItem,
  field: WPItem['wp:postmeta'][number]['wp:meta_key'],
) {
  return item['wp:postmeta'].find((m) => m['wp:meta_key'] === field)?.[
    'wp:meta_value'
  ];
}
