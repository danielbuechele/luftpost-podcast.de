import {Episode} from 'contentlayer/generated';
import Link from 'next/link';
import styles from '@/styles/Episode.module.css';
import ReactMarkdown from 'react-markdown';
import Body from './Body';
import Player from './Player';
import Flag from './Flag';

type Props = {episode: Episode; truncate?: boolean};

export default function Episode(props: Props) {
  return (
    <article className={styles.episode}>
      <div className={styles.title}>
        <Flag
          className={styles.flag}
          countryCode={props.episode.countryCode ?? null}
        />
        <hgroup>
          <Link href={props.episode.slug}>
            <h1>{props.episode.title}</h1>
          </Link>
          <div className={styles.subtitle}>
            mit{' '}
            <ReactMarkdown allowedElements={['a']} unwrapDisallowed>
              {props.episode.guest}
            </ReactMarkdown>{' '}
            vom{' '}
            <time dateTime={props.episode.publishedAt}>
              {new Date(props.episode.publishedAt).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </div>
        </hgroup>
      </div>
      <Player episode={props.episode} />
      <Body className={props.truncate ? styles.bodyTruncate : ''}>
        {props.episode.body}
      </Body>

      {props.truncate && (
        <div className={styles.meta}>
          <Link href={props.episode.slug}>&raquo; Zur Episode</Link>
        </div>
      )}
    </article>
  );
}
