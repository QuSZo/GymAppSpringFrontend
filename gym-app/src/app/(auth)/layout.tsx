import styles from "./layout.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href={"/"}>GYMNOTES</Link>
      </div>
      <div className={styles.left}>{children}</div>
      <div className={styles.imageWrapper}>
          <div className={styles.image2ndWrapper}>
              <Image src="/assets/agh.svg" alt="Gym photo" fill className={styles.image}></Image>
          </div>
      </div>
    </div>
  );
}
