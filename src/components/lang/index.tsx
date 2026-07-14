import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useMemo, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { langMap } from "./consts";
import { DynamicList } from "../common/dynamic-list";

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
      <button
        aria-expanded={open}
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        type="button"
      >
        {i18n.language}
      </button>
      <ul className={`${styles.languageList} ${open ? styles.open : ""}`}>
        <DynamicList<string>
          data={langList}
          loading={false}
          renderListItem={(code) => {
          const language = (langMap as any)[code];
          return (
            <li key={code}>
              <button
                className={`${styles.language} ${
                  code === i18n.language ? styles.active : ""
                }`}
                onClick={() => {
                  i18n.changeLanguage(code);
                  setOpen(false);
                }}
                type="button"
              >
                {t(`lang.${language}`)}
              </button>
            </li>
          );
        }}
        />
      </ul>
    </div>
  );
};
