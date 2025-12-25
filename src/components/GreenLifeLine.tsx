import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    const animation = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
      },
    });

    return () => {
      animation.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 100 1000"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
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
        stroke="#C4D600"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.6"
        style={{ willChange: "stroke-dashoffset" }}
      />
    </svg>
  );
};

export default GreenLifeLine;
