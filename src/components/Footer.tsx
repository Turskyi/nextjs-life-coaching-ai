import Link from 'next/link';
import Image from 'next/image';
import { APP_NAME } from '../../constants';

export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-3 p-3 md:flex-row md:justify-evenly">
      <nav className="flex gap-3">
        <Link href="/privacy">Privacy</Link>
      </nav>
      <div className="flex flex-col items-center md:flex-row md:items-center">
        <span className="footer-title">Download the {APP_NAME}® App</span>
        <a
          href="https://play.google.com/store/apps/details?id=com.turskyi.lifecoach"
          target="_blank"
          style={{ marginLeft: 10 }}
        >
          <Image
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            width={240}
            height={80}
          />
        </a>
      </div>
    </footer>
  );
}
