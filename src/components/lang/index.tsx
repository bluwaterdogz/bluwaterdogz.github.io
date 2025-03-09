import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useMemo, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { langMap } from "./consts";

interface LangProps {
  className?: string;
  dark?: boolean;
  alignRight?: boolean;
}

export const Lang = (props: LangProps) => {
  const { className = "", alignRight = false, dark = false } = props;
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const langList = useMemo(() => Object.keys(langMap), [langMap]);
  useOutsideClick(ref, () => setOpen(false));
  return (
    <div
      className={`
        ${className} 
        ${styles.languageDropdown} 
        ${dark ? styles.dark : ""} 
        ${alignRight ? styles.right : ""}
      `}
      ref={ref}
    >
      <p onClick={() => setOpen(!open)}>{i18n.language}</p>
      <div className={`${styles.languageList} ${open ? styles.open : ""}`}>
        {langList.map((code) => {
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
