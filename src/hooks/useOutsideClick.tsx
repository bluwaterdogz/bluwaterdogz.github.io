import { useEffect, RefObject } from "react";

/**
 * https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */
export function useOutsideClick(
  ref: RefObject<any>,
  callback: (...args: any) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
