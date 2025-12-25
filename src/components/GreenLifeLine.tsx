import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GreenLifeLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    // Set initial state - line fully hidden
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // Animate the line drawing based on scroll with smooth scrub
    const animation = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // Smooth 0.5s lag for premium feel
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Custom path that respects layout gutters:
  // - Start: Top center (50%) behind Hero H1
  // - Segment 1: Straight down to Problem section center
  // - Segment 2: Curve LEFT to 12% for Features (left gutter next to text)
  // - Segment 3: Curve back to CENTER (50%) for Impact grid
  // - Segment 4: Flow down to Pricing and fade
  const pathD = `
    M 50 0
    L 50 8
    Q 50 12, 50 15
    L 50 22
    Q 50 26, 30 30
    Q 12 34, 12 40
    L 12 52
    Q 12 58, 30 62
    Q 50 66, 50 72
    L 50 82
    Q 50 88, 50 92
    L 50 100
  `;

  return (
    <svg
      ref={svgRef}
      className="green-life-line absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* The winding path - lime green connector */}
      <path
        ref={pathRef}
        className="life-line-path"
        d={pathD}
        fill="none"
        stroke="hsl(68, 100%, 42%)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
        style={{
          willChange: "stroke-dashoffset",
          transform: "translateZ(0)",
        }}
      />
    </svg>
  );
};

export default GreenLifeLine;
