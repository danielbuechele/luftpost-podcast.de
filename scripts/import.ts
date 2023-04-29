import {parseStringPromise} from 'xml2js';
import fs from 'fs/promises';
import {join} from 'path';
import {NodeHtmlMarkdown} from 'node-html-markdown';

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

  console.log(items.at(0));

  for (const i of items) {
    const [latitude, longitude] =
      getMetaField(i, 'geolocation')?.split(',') ?? [];

    const [mediaUrl, byteSize, mimeType, meta] =
      getMetaField(i, 'enclosure')?.split('\r\n') ?? [];

    const guest = getMetaField(i, 'guest');

    await fs.writeFile(
      join(__dirname, '..', 'episodes', `${i['wp:post_id']}.md`),
      `---
title: ${i.title.replace(/&amp;/g, '&')}
publishedAt: ${i.pubDate}
guest: ${NodeHtmlMarkdown.translate(guest ?? '')}
countryCode: ${getMetaField(i, 'countrycode')}
latitude: ${latitude}
longitude: ${longitude}
durationSeconds: 1354
byteSize: ${byteSize} 
mediaUrl: ${mediaUrl}
mimeType: ${mimeType}
---

${NodeHtmlMarkdown.translate(i['content:encoded'])}
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
