import { useEffect, useState } from "react";

export default function FloatingBubbles() {
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="floating-bubbles-container pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="ambient-bubble bubble-1"
        style={{ transform: `translate3d(0, ${scrollPos * -0.06}px, 0)` }}
      />
      <div
        className="ambient-bubble bubble-2"
        style={{ transform: `translate3d(0, ${scrollPos * -0.1}px, 0)` }}
      />
      <div
        className="ambient-bubble bubble-3"
        style={{ transform: `translate3d(0, ${scrollPos * -0.04}px, 0)` }}
      />
      <div
        className="ambient-bubble bubble-4"
        style={{ transform: `translate3d(0, ${scrollPos * -0.12}px, 0)` }}
      />
      <div
        className="ambient-bubble bubble-5"
        style={{ transform: `translate3d(0, ${scrollPos * -0.07}px, 0)` }}
      />
    </div>
  );
}
