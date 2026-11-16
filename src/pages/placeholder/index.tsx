import { BackgroundAnimation } from "../../components/common/background-animation";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

export const PlaceholderPage = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.content}>
      <BackgroundAnimation />
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {t("placeholder.comingSoon")
            .split(" ")
            .map((word) => (
              <p key={word}>
                {[...word].map((letter, index) => (
                  <span className={styles.letter} key={`${letter}-${index}`}>
                    {letter}
                  </span>
                ))}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};
