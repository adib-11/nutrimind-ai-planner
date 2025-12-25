import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GreenLifeLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state - line starts mostly hidden
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length * 0.92,
    });

    setIsReady(true);

    // Animate the line drawing based on scroll with smooth scrub
    const animation = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // 1-second smoothing for premium feel
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <svg
      className="green-life-line fixed top-0 left-0 w-screen h-screen pointer-events-none"
      style={{ 
        zIndex: 50, // Above content
        mixBlendMode: "multiply",
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Glow filter for premium look */}
      <defs>
        <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.4" result="blur" />
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
          Q 15 12, 50 25
          T 50 50
          Q 85 62, 50 75
          T 50 100
        "
        fill="none"
        stroke="#C4D600"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.75"
        filter="url(#greenGlow)"
      />
    </svg>
  );
};

export default GreenLifeLine;
