import { useRef, useState, useEffect } from "react";
export function useIsVisible<T extends Element>() {
  const domRef = useRef<T>(null);

  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);

        if (domRef?.current) observer.unobserve(domRef?.current);
      }
    });
    if (domRef?.current) observer.observe(domRef?.current);

    return () => observer.disconnect();
  }, []);
  return { isVisible, domRef };
}
