import styles from '@/styles/Player.module.css';
import {secondsToTime} from '@/utils/time';
import AudioPlayer from 'react-h5-audio-player';
import cover from '@/../public/cover.png';
import Image from 'next/image';
import {useState} from 'react';
import {Episode} from 'contentlayer/generated';
import Link from 'next/link';

export default function Player(props: {episode: Episode}) {
  const [playing, isPlaying] = useState(false);

  return (
    <div className={styles.playerContainer}>
      <div className={styles.cover}>
        <Image
          src={cover}
          width={100}
          height={100}
          alt="Luftpost Podcast Cover-Bild"
        />
      </div>
      {/* @ts-ignore */}
      <AudioPlayer
        defaultCurrentTime="0:00"
        defaultDuration={secondsToTime(props.episode.durationSeconds)}
        src={props.episode.mediaUrl}
        preload="none"
        customAdditionalControls={[
          <div key="1">
            <Link
              onClick={(e) => {
                if (typeof window.navigator.share == 'function') {
                  e.preventDefault();
                  window.navigator.share();
                }
              }}
              href={props.episode.slug}
            >
              Teilen
            </Link>
            &nbsp;&middot;&nbsp;
            <a
              download={props.episode.mediaUrl.split('/').pop()}
              target="_blank"
              href={props.episode.mediaUrl}
            >
              {' '}
              Download
              {props.episode.byteSize > 0 && (
                <>
                  &nbsp;(
                  {Math.floor(props.episode.byteSize / 1024 / 1024)}
                  &nbsp;MB)
                </>
              )}
            </a>
          </div>,
        ]}
        customVolumeControls={playing ? undefined : []}
        showJumpControls={false}
        onPlay={() => isPlaying(true)}
        onPause={() => isPlaying(false)}
        className={styles.player}
        customIcons={{
          play: <PlayerButton state="play" />,
          pause: <PlayerButton state="pause" />,
        }}
      />
    </div>
  );
}

function PlayerButton(props: {state: 'play' | 'pause'}) {
  return (
    <>
      <svg
        className={styles.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 22"
      >
        <g fill="none" fillRule="evenodd">
          <path
            fillRule="nonzero"
            fill="white"
            d={
              props.state === 'play'
                ? 'M2.36807692,21.8609375 C2.91885817,21.8609375 3.41104567,21.696875 4.07901442,21.3101562 L18.2118269,13.11875 C19.2899519,12.4859375 19.8524519,11.8882812 19.8524519,10.9507812 C19.8524519,10.0132812 19.2899519,9.415625 18.2118269,8.79453125 L4.07901442,0.59140625 C3.41104567,0.2046875 2.91885817,0.040625 2.36807692,0.040625 C1.24307692,0.040625 0.317295673,0.89609375 0.317295673,2.3375 L0.317295673,19.5640625 C0.317295673,21.0054687 1.24307692,21.8609375 2.36807692,21.8609375 Z'
                : 'M6.46183594,21.9527344 C7.83292969,21.9527344 8.53117187,21.2544922 8.53117187,19.8833984 L8.53117187,2.09726563 C8.53117187,0.726171875 7.83292969,0.066015625 6.46183594,0.0279296875 L3.31339844,0.0279296875 C1.94230469,0.0279296875 1.2440625,0.726171875 1.2440625,2.09726563 L1.2440625,19.8833984 C1.21867187,21.2544922 1.91691406,21.9527344 3.31339844,21.9527344 L6.46183594,21.9527344 Z M16.8466016,21.9527344 C18.2303906,21.9527344 18.9159375,21.2544922 18.9159375,19.8833984 L18.9159375,2.09726563 C18.9159375,0.726171875 18.2303906,0.0279296875 16.8466016,0.0279296875 L13.6981641,0.0279296875 C12.3270703,0.0279296875 11.6288281,0.726171875 11.6288281,2.09726563 L11.6288281,19.8833984 C11.6288281,21.2544922 12.3016797,21.9527344 13.6981641,21.9527344 L16.8466016,21.9527344 Z'
            }
          />
        </g>
      </svg>
      <span className={styles.label}>
        {props.state === 'play' ? 'Play' : 'Pause'}
      </span>
    </>
  );
}
