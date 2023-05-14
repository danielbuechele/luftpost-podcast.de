import {defineDocumentType, makeSource} from 'contentlayer/source-files';

export const Episode = defineDocumentType(() => ({
  name: 'Episode',
  filePathPattern: `episodes/*.md`,
  computedFields: {
    slug: {
      type: 'string',
      resolve: ({_raw}) => _raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
  fields: {
    title: {
      type: 'string',
      description: 'The title of the episode',
      required: true,
    },
    publishedAt: {
      type: 'date',
      description: 'The publish date of the episode',
      required: true,
    },
    guid: {
      type: 'string',
      description: 'The GUID used in feed. If not used, the slug is used',
      required: false,
    },
    guest: {
      type: 'string',
      description: 'The name of the guest in this episode',
      required: true,
    },
    countryCode: {
      type: 'string',
      description: 'The ISO 3166-1 country code',
      required: false,
    },
    latitude: {
      type: 'number',
      description: 'The title of the episode',
      required: false,
    },
    longitude: {
      type: 'number',
      description: 'The longitude',
      required: false,
    },
    durationSeconds: {
      type: 'number',
      description: 'The duration of the episode in seconds',
      required: true,
    },
    byteSize: {
      type: 'number',
      description: 'Size in bytes of the enclosure',
      required: true,
    },
    mediaUrl: {
      type: 'string',
      description: 'The link to the enclosure',
      required: true,
    },
    mimeType: {
      type: 'string',
      default: 'audio/mpeg',
      description: 'The MIME type of the enclosure',
      required: false,
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: `pages/*.md`,
  computedFields: {
    slug: {
      type: 'string',
      resolve: ({_raw}) => _raw.sourceFileName.replace(/\.md$/, ''),
    },
  },
  fields: {
    title: {
      type: 'string',
      description: 'The title of the episode',
      required: true,
    },
    image: {
      type: 'string',
      description: 'URL of the image shown on the side of the page',
      required: true,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Episode, Page],
});
