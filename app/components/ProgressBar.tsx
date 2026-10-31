import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/** Thin bar at the top of the page showing how far down the page you are. */
export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar.current) bar.current.style.width = max > 0 ? `${(scrollY / max) * 100}%` : "0";
    };
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, [pathname]);
  return <div id="progress" ref={bar} />;
}
