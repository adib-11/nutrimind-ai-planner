import { useEffect, useState, useRef } from "react";

const GreenLifeLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0.08);

  // Get path length after mount
  useEffect(() => {
    const updateLength = () => {
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        setPathLength(length);
      }
    };
    
    updateLength();
    const timeout = setTimeout(updateLength, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0.08, scrollTop / Math.max(docHeight, 1)));
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashOffset = pathLength > 0 ? pathLength * (1 - scrollProgress) : 0;

  return (
    <svg
      className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: 4 }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Glow filter for premium look */}
      <defs>
        <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* The winding S-curve path - lime green connector */}
      <path
        ref={pathRef}
        d="
          M 50 0
          Q 20 12, 50 25
          T 50 50
          Q 80 62, 50 75
          T 50 100
        "
        fill="none"
        stroke="#C4D600"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
        filter="url(#greenGlow)"
        style={{
          strokeDasharray: pathLength || 1000,
          strokeDashoffset: dashOffset,
          transition: "stroke-dashoffset 0.15s ease-out",
        }}
      />
    </svg>
  );
};

export default GreenLifeLine;
