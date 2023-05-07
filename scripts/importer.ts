import {parseStringPromise} from 'xml2js';
import fs from 'fs/promises';
import {join} from 'path';
import {NodeHtmlMarkdown} from 'node-html-markdown';
var phpUnserialize = require('phpunserialize');

const file =
  '/Users/danielbuechele/Downloads/luftpostpodcast.WordPress.2023-04-30.xml';

type WPItem = {
  title: string;
  pubDate: string;
  link: `https://luftpost-podcast.de/${string}`;
  description: string;
  guid: {
    _: string;
  };
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

  for (const i of items) {
    const [latitude, longitude] =
      getMetaField(i, 'geolocation')?.split(',') ?? [];

    const [mediaUrl, byteSize, mimeType, meta] =
      getMetaField(i, 'enclosure')?.split(/\r?\n/g) ?? [];

    let durationSeconds = -1;
    if (meta) {
      const s: string | undefined = phpUnserialize(meta).length;

      if (s) {
        durationSeconds = s
          .split(':')
          .reverse()
          .reduce((acc, cv, i) => acc + parseInt(cv, 10) * Math.pow(60, i), 0);
      }
    }

    let guest = getMetaField(i, 'guest');
    if ((guest?.indexOf('<a') ?? -1) > -1) {
      guest = `'${NodeHtmlMarkdown.translate(guest!)}'`;
    }

    let title = i.title.replace(/&amp;/g, '&');
    if (title.indexOf(':') > -1) {
      title = `'${title}'`;
    }

    const frontMatter = new Map();
    frontMatter.set('title', title);
    frontMatter.set('publishedAt', i.pubDate);
    frontMatter.set('guest', guest),
      frontMatter.set('countryCode', getMetaField(i, 'countrycode'));
    frontMatter.set('latitude', latitude);
    frontMatter.set('longitude', longitude);
    frontMatter.set('durationSeconds', durationSeconds);
    frontMatter.set('byteSize', byteSize);
    frontMatter.set('mediaUrl', mediaUrl);
    frontMatter.set('mimeType', mimeType);
    frontMatter.set('guid', i.guid._);

    const slug = new URL(i.link).pathname.replaceAll('/', '');
    await fs.writeFile(
      join(__dirname, '..', 'episodes', `${slug}.md`),
      `---
${Array.from(frontMatter.entries())
  .map(([k, v]) => `${k}: ${v}`)
  .join('\n')}
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
