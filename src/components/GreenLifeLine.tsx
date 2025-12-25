import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger);

const GreenLifeLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!pathRef.current || !svgRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state - line is hidden
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Animate the line drawing based on scroll
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5]"
      preserveAspectRatio="none"
      viewBox="0 0 100 1000"
      style={{ mixBlendMode: "screen" }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(68 100% 42%)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="hsl(68 100% 50%)" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(68 100% 42%)" stopOpacity="0.8" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      <path
        ref={pathRef}
        d="
          M 50 0
          C 50 50, 20 100, 50 150
          S 80 200, 50 250
          C 20 300, 80 350, 50 400
          S 20 450, 50 500
          C 80 550, 20 600, 50 650
          S 80 700, 50 750
          C 20 800, 80 850, 50 900
          S 20 950, 50 1000
        "
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="0.5"
        strokeLinecap="round"
        filter="url(#glow)"
        style={{ willChange: "stroke-dashoffset" }}
      />
      
      {/* Decorative nodes along the path */}
      {[150, 400, 650, 900].map((y, i) => (
        <circle
          key={i}
          cx="50"
          cy={y}
          r="1.5"
          fill="hsl(68 100% 42%)"
          opacity="0.6"
          className="animate-pulse"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
};

export default GreenLifeLine;
