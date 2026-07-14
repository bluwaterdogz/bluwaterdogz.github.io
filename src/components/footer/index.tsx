import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../stores/ThemeStore";
import styles from "./styles.module.scss";

interface FooterProps {
  backgroundImageUrl?: string;
}

export const Footer = ({
  backgroundImageUrl = "/images/home/theme1.jpg",
}: FooterProps) => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const year = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("theme-light", "theme-dark");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);
  return (
    <section
      className={styles.footer}
      style={
        backgroundImageUrl
          ? { backgroundImage: `url(${backgroundImageUrl})` }
          : undefined
      }
    >
      <div className={styles.footerContent}>
        <div className={styles.linkList}>
          <div className={styles.footerLink}>
            <a href="https://github.com/bluwaterdogz" target={"_blank"}>
              <i className="devicon-github-original"></i> Github
            </a>
          </div>
          <div className={styles.footerLink}>
            <a
              href="https://linkedin.com/in/brian-velasquez-developer"
              target={"_blank"}
            >
              <i className="devicon-linkedin-plain"></i> LinkedIn
            </a>
          </div>
          <div className={styles.footerLink}>
            <a href="mailto:bveedy@gmail.com">
              <i className="fa fa-envelope"></i> bveedy@gmail.com
            </a>
          </div>
        </div>
        <button className={styles.themeToggle} onClick={toggleTheme} type="button">
          <i
            className={`fa ${theme === "light" ? "fa-moon-o" : "fa-sun-o"}`}
            aria-hidden="true"
          />
          {t(`theme.${theme === "light" ? "dark" : "light"}`)}
        </button>
        <div className={styles.trademark}>© {year}</div>
      </div>
    </section>
  );
};
