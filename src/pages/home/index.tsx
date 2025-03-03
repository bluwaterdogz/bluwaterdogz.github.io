import { useCallback, useEffect } from "react";
import { useServiceContext } from "../../service";
import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { useTranslation } from "react-i18next";

export const HomePage = () => {
  const { jobService } = useServiceContext();

  const getData = useCallback(async () => {
    const data = await jobService.list();
  }, [jobService]);

  useEffect(() => {
    getData();
  }, [getData]);

  const { t } = useTranslation();
  return (
    <div>
      <section
        className={styles.hero}
        style={{
          backgroundImage: "url(./dog.jpg)",
        }}
      >
        <div className={styles.container}>
          <Nav vertical={true} />

          <div className={styles.content}>
            <h1>Brian Velasquez</h1>
            <p className={styles.headerSubtext}>{t("home.sub")}</p>
          </div>
        </div>
      </section>
      <section className={styles.textSection}>
        <div className={styles.container}>
          <Nav vertical={true} dark={true} />
          <div className={styles.content}>
            <h2>{t("home.section1Title")}</h2>
            <p>{t("home.section1Content1")}</p>
            <hr />
            <p>{t("home.section1Content2")}</p>
          </div>
        </div>
      </section>
      <section className={styles.imageSection}>
        <div className={styles.container}>
          <div
            style={{
              backgroundImage: "url(./imgs/theme1.jpg)",
            }}
            className={styles.img}
          ></div>
          <Nav vertical={true} />
        </div>
      </section>
      <section className={`${styles.textSection} ${styles.right}`}>
        <div className={styles.container}>
          <Nav vertical={true} dark={true} />
          <div className={styles.content}>
            <h2>{t("home.section2Title")}</h2>
            <p>{t("home.section2Content1")}</p>
          </div>
        </div>
      </section>

      <section className={styles.imageSection}>
        <div className={styles.container}>
          <div
            style={{
              backgroundImage: "url(./imgs/theme2.jpg)",
            }}
            className={styles.img}
          ></div>
          <Nav vertical={true} />
        </div>
      </section>
    </div>
  );
};
