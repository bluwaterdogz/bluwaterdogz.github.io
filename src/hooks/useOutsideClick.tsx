import { useEffect, RefObject } from "react";

/**
 * https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent) => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current != null &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        callback(event);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, ref]);
}
