import { Lang } from "../../components/lang";
import styles from "./styles.module.scss";
import HomeNav from "../../components/nav/home-nav";
import { useTranslation } from "react-i18next";

interface HeroSectionProps {
  imgUrl?: string;
}

export const HeroSection = (props: HeroSectionProps) => {
  const { imgUrl = "./imgs/head_shot.png" } = props;
  const { t } = useTranslation();

  return (
    <section className={styles.hero}>
      <div
        className={styles.background}
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      ></div>
      <div className={styles.container}>
        <HomeNav className={styles.nav} />
        <Lang className={styles.languageDropdown} />
        <div className={styles.content}>
          <h1
            dangerouslySetInnerHTML={{
              __html: t(`home.header`, ""),
            }}
          ></h1>
        </div>
      </div>
    </section>
  );
};
