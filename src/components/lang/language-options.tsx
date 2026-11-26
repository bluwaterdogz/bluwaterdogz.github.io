import { useTranslation } from "react-i18next";
import { langMap } from "./consts";
import styles from "./styles.module.scss";

interface LanguageOptionsProps {
  activeLanguage: string;
  languages: Array<keyof typeof langMap>;
  onSelect: (code: keyof typeof langMap) => void;
}

export const LanguageOptions = ({
  activeLanguage,
  languages,
  onSelect,
}: LanguageOptionsProps) => {
  const { t } = useTranslation();

  return languages.map((code) => (
    <li key={code}>
      <button
        className={`${styles.language} ${
          code === activeLanguage ? styles.active : ""
        }`}
        onClick={() => onSelect(code)}
        type="button"
      >
        {t(`lang.${langMap[code]}`)}
      </button>
    </li>
  ));
};
