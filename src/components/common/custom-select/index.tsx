import { KeyboardEvent, useRef, useState } from "react";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { InputGroup } from "../input-group";
import styles from "./styles.module.scss";

export interface SelectOption {
  label: string;
  value: string;
}

interface CustomSelectProps {
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
}

export const CustomSelect = ({
  label,
  onChange,
  options,
  value,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useOutsideClick(rootRef, () => setIsOpen(false));

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") setIsOpen(false);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <InputGroup className={styles.field} label={label}>
      <div ref={rootRef}>
        <div className={styles.control}>
          <button
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={styles.trigger}
            onClick={() => setIsOpen((current) => !current)}
            onKeyDown={handleKeyDown}
            type="button"
          >
            <span>{selectedOption?.label ?? options[0]?.label}</span>
            <i className="fa fa-chevron-down" aria-hidden="true" />
          </button>
          {isOpen && (
            <ul className={styles.options} role="listbox">
              {options.map((option) => (
                <li
                  aria-selected={option.value === value}
                  key={option.value}
                  role="option"
                >
                  <button
                    className={
                      option.value === value ? styles.selected : undefined
                    }
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    type="button"
                  >
                    {option.label}
                    {option.value === value && (
                      <i className="fa fa-check" aria-hidden="true" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </InputGroup>
  );
};
