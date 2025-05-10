"use client";

import styles from "@/app/errors.module.scss";
import Link from "next/link";
import Button from "@/common/components/Button/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className={styles.container}>
      <p className={styles.info}>Ooops..</p>
      <p className={styles.status}>500</p>
      <p className={styles.statusMessage}>Coś poszło nie tak. Spróbuj ponownie później.</p>
      <div className={styles.buttonContainer}>
        <Link href="/">
          <Button className={styles.button}>Wróć na stronę główną</Button>
        </Link>
        <Button onClick={() => reset()} className={styles.button}>
          Spróbuj ponownie
        </Button>
      </div>
    </div>
  );
}
