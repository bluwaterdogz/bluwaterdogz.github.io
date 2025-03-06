import styles from "./styles.module.scss";
import Nav from "../../components/nav";
import { useTranslation } from "react-i18next";
import { DarkOverlay } from "../../components/common/dark-overlay";
import { Lang } from "../../components/lang";
import { ProfilePicture } from "../../components/common/profile-picture";

export const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <section
        className={styles.hero}
        style={{
          backgroundImage: "url(./dog.jpg)",
        }}
      >
        <DarkOverlay />
        <div className={styles.container}>
          <div className={styles.nav}>
            <Nav vertical={true} />
          </div>
          <div className={styles.lang}>
            <Lang className={styles.languageDropdown} />
          </div>

          <div className={styles.content}>
            <h1>Brian Velasquez</h1>
            <p className={styles.headerSubtext}>{t("home.sub")}</p>
          </div>
        </div>
      </section>
      <section className={styles.profileSection}>
        <div className={styles.container}>
          <div className={styles.nav}>
            <Nav vertical={true} dark={true} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentImage}>
              <ProfilePicture size={"medium"} />
            </div>
            <p>
              Senior full-stack Web Developer with expertise in Typescript,
              React, Angular, Node and Python. Experienced in leading and
              collaborating with international teams, modernizing legacy
              applications, and developing CI/CD pipelines.
            </p>
            {/* <hr />
            <p>{t("home.section1Content2")}</p> */}
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
          <div className={styles.nav}>
            <Nav vertical={true} />
          </div>
        </div>
      </section>
      <section className={styles.textSection}>
        <div className={styles.container}>
          <div className={styles.nav}>
            <Nav vertical={true} dark={true} />
          </div>
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
              backgroundImage: "url(./imgs/theme2.jpg)",
            }}
            className={styles.img}
          ></div>
          <div className={styles.nav}>
            <Nav vertical={true} />
          </div>
        </div>
      </section>
      <section className={`${styles.textSection} ${styles.right}`}>
        <div className={styles.container}>
          <div className={styles.nav}>
            <Nav vertical={true} dark={true} />
          </div>
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
              backgroundImage: "url(./imgs/theme3.jpg)",
            }}
            className={styles.img}
          ></div>
          <div className={styles.nav}>
            <Nav vertical={true} />
          </div>
        </div>
      </section>
    </div>
  );
};
