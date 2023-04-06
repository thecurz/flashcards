import styles from "@/styles/navbar.module.css";
import Link from "next/link";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbar_deck_options}>
        <h1 className={styles.navbar_title}>FakeAnki</h1>
        <Link href="" className={styles.navbar_link}>
          <span className={styles.navbar_span}>Decks</span>
        </Link>
        <Link href="" className={styles.navbar_link}>
          <span className={styles.navbar_span}>Add</span>
        </Link>
        <Link href="" className={styles.navbar_link}>
          <span className={styles.navbar_span}>Search</span>
        </Link>
      </div>
      <div className={styles.navbar_account}>
        <Link href="" className={styles.navbar_link}>
          <span className={styles.navbar_span}>Account</span>
        </Link>
        <Link href="" className={styles.navbar_link}>
          <span className={styles.navbar_span}>Log Out</span>
        </Link>
      </div>
    </nav>
  );
}