import '@/styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-h5-audio-player/lib/styles.css';
import type {AppProps} from 'next/app';
import localFont from 'next/font/local';
import {Fira_Sans} from 'next/font/google';

const Futura = localFont({
  src: '../../public/futura_pt_medium.woff2',
  weight: '500',
  variable: '--futura',
});

const Fira300 = Fira_Sans({
  weight: '300',
  subsets: ['latin'],
  variable: '--fira-300',
});

const Fira400 = Fira_Sans({
  weight: '400',
  subsets: ['latin'],
  variable: '--fira-400',
});

export default function App({Component, pageProps}: AppProps) {
  return (
    <div
      className={`${Futura.variable} ${Fira300.variable} ${Fira400.variable}`}
    >
      <Component {...pageProps} />
    </div>
  );
}
