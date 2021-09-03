import React from "react";

export function useScrollSpy(selectors, options) {
  const [activeId, setActiveId] = React.useState();
  const observer = React.useRef();
  React.useEffect(() => {
    const elements = selectors
      .filter((selector) => document.querySelector(selector))
      .map((selector) => document.querySelector(selector));
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute("id"));
        }
      });
    }, options);
    elements.forEach((el) => observer.current.observe(el));
    return () => observer.current.disconnect();
  }, [selectors, options]);

  return activeId;
}
