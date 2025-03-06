import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

interface LangProps {
  className?: string;
}

export const Lang = ({ className = "" }: LangProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const langMap = {
    en: "english",
    zh: "chinese",
    es: "espanol",
    th: "thai",
    de: "german",
    ko: "korean",
  };
  useOutsideClick(ref, () => setOpen(false));
  return (
    <div className={`${className} ${styles.languageDropdown}`} ref={ref}>
      <p onClick={() => setOpen(!open)}>{i18n.language}</p>
      <div className={`${styles.languageList} ${open ? styles.open : ""}`}>
        {Object.keys(langMap).map((code) => {
          const language = (langMap as any)[code];
          return (
            <div
              key={code}
              className={`${styles.language} ${
                code === i18n.language ? styles.active : ""
              }`}
              onClick={() => {
                i18n.changeLanguage(code), setOpen(false);
              }}
            >
              {t(`lang.${language}`)}
            </div>
          );
        })}
      </div>
    </div>
  );
};
