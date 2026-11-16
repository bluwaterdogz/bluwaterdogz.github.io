import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { MorphingBlobBackground } from "../../components/home/animated-backgrounds/morphing-blob-background";
import { lightBlobColors } from "../../components/home/animated-backgrounds/morphing-blob-background/colors";
import styles from "./styles.module.scss";

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className={styles.page}>
      <MorphingBlobBackground colors={lightBlobColors}>
        <div className={styles.content}>
          <h1>404</h1>
          <Link to="/">
            <span aria-hidden="true">&#8592;</span>
            {t("nav.home")}
          </Link>
        </div>
      </MorphingBlobBackground>
    </main>
  );
};
