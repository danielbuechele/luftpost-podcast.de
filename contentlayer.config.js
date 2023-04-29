import {defineDocumentType, makeSource} from 'contentlayer/source-files';

export const Episode = defineDocumentType(() => ({
  name: 'Episode',
  filePathPattern: `**/*.md`,
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
    guest: {
      type: 'string',
      description: 'The name of the guest in this episode',
      required: true,
    },
    countryCode: {
      type: 'string',
      description: 'The ISO 3166-1 country code',
      required: true,
    },
    latitude: {
      type: 'number',
      description: 'The title of the episode',
      required: true,
    },
    longitude: {
      type: 'number',
      description: 'The longitude',
      required: true,
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
  //   computedFields: {
  //     url: {
  //       type: "string",
  //       resolve: (post) => `/episodes/${post._raw.flattenedPath}`,
  //     },
  //   },
}));

export default makeSource({
  contentDirPath: 'episodes',
  documentTypes: [Episode],
});
