import Image from 'next/image';
import styles from '@/styles/Flag.module.css';

export default function Flag(props: {countryCode: string; className?: string}) {
  return (
    <Image
      width={64}
      height={64}
      className={`${styles.flag} ${props.className ?? ''}`}
      src={`/flags/${props.countryCode}.png`}
      alt={`Flagge von ${props.countryCode}`}
    />
  );
}
