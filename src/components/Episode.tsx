import {Episode} from 'contentlayer/generated';
import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/Episode.module.css';
import {Fira_Sans} from 'next/font/google';
import ReactMarkdown from 'react-markdown';

const fira = Fira_Sans({weight: '400', subsets: ['latin']});

type Props = {episode: Episode};

export default function Episode(props: Props) {
  return (
    <article className={styles.episode}>
      <div className={styles.title}>
        <Image
          width={64}
          height={64}
          className={styles.flag}
          src={`/flags/${props.episode.countryCode}.png`}
          alt={`Flagge von ${props.episode.countryCode}`}
        />
        <hgroup>
          <Link href={`${props.episode._raw.flattenedPath}`}>
            <h1>{props.episode.title}</h1>
          </Link>
          <span className={fira.className}>
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
          </span>
        </hgroup>
      </div>
      <ReactMarkdown>{props.episode.body.raw}</ReactMarkdown>
      <iframe
        id="embedPlayer"
        src="https://embed.podcasts.apple.com/de/podcast/marokko/id409553739?i=1000602855910&amp;itsct=podcast_box_player&amp;itscg=30200&amp;ls=1&amp;theme=light"
        height="175px"
        frameBorder="0"
        sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
        allow="autoplay *; encrypted-media *; clipboard-write"
        className={styles.player}
        // style="width: 100%; max-width: 660px; overflow: hidden; border-radius: 10px; transform: translateZ(0px); animation: 2s 6 loading-indicator; background-color: rgb(228, 228, 228);"
      ></iframe>
    </article>
  );
}
