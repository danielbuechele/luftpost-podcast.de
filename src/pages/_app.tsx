import '@/styles/globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import type {AppProps} from 'next/app';
import localFont from 'next/font/local';

const Futura = localFont({
  src: '../../public/futura_pt_medium.woff2',
  variable: '--futura-font',
});

export default function App({Component, pageProps}: AppProps) {
  return (
    <div className={Futura.variable}>
      <Component {...pageProps} />
    </div>
  );
}
