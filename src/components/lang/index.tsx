import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";
import { useRef, useState } from "react";
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
  const langList = Object.keys(langMap) as (keyof typeof langMap)[];
  useOutsideClick(ref, () => setOpen(false));
  return (
    <div
      className={[
        styles.languageDropdown,
        dark ? styles.dark : "",
        alignRight ? styles.right : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
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
        <DynamicList<keyof typeof langMap>
          data={langList}
          loading={false}
          renderListItem={(code) => {
            const language = langMap[code];
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
