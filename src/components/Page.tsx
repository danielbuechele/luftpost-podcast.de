import {Fira_Sans} from 'next/font/google';
import Link from 'next/link';
import styles from '@/styles/Page.module.css';
import Image from 'next/image';
import logo from '@/../public/logo-2.png';

const fira = Fira_Sans({weight: '300', subsets: ['latin']});

export default function Page({children, aside}: {children: any; aside: any}) {
  return (
    <div className={`${fira.className} ${styles.container}`}>
      <aside className={styles.aside}>{aside}</aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <ul>
              <li>
                <Link href="/">Mitmachen</Link>
              </li>
              <li>
                <Link href="/">Informationen</Link>
              </li>
              <li>
                <Link href="/">Abonnieren</Link>
              </li>
            </ul>
          </nav>
          <Link href="/">
            <Image
              src={logo}
              width={158}
              height={158}
              alt="Logo Luftpost Podcast"
            />
          </Link>
        </header>
        {children}
      </main>
    </div>
  );
}
