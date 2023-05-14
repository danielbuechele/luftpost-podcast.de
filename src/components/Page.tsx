import {Fira_Sans} from 'next/font/google';
import Link from 'next/link';
import styles from '@/styles/Page.module.css';
import Image from 'next/image';
import logo from '@/../public/logo-2.png';
import {usePathname} from 'next/navigation';

const fira = Fira_Sans({weight: '300', subsets: ['latin']});

export default function Page({children, aside}: {children: any; aside: any}) {
  return (
    <div className={`${fira.className} ${styles.container}`}>
      <aside className={styles.aside}>{aside}</aside>
      <main className={styles.main}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <ul>
              <NavLink href="/alle-episoden">Alle Episoden</NavLink>
              <NavLink href="/mitmachen">Mitmachen</NavLink>
              <NavLink href="/about">Informationen</NavLink>
              <NavLink href="/abonnieren">Abonnieren</NavLink>
            </ul>
          </nav>
          <Link href="/" className={styles.logo}>
            <Image
              priority
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

function NavLink(props: {href: string; children: string}) {
  const pathname = usePathname();
  return (
    <li>
      <Link
        className={pathname === props.href ? styles.activeLink : ''}
        href={props.href}
      >
        {props.children}
      </Link>
    </li>
  );
}
