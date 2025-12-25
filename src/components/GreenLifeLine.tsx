import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GreenLifeLine = () => {
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [pageHeight, setPageHeight] = useState(0);

  useEffect(() => {
    // Get full document height
    const updateHeight = () => {
      setPageHeight(document.documentElement.scrollHeight);
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    
    // Delay to ensure page is fully rendered
    const timeout = setTimeout(updateHeight, 500);

    return () => {
      window.removeEventListener("resize", updateHeight);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!pathRef.current || !svgRef.current || pageHeight === 0) return;

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
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === "body") t.kill();
      });
    };
  }, [pageHeight]);

  if (pageHeight === 0) return null;

  return (
    <div
      className="pointer-events-none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${pageHeight}px`,
        zIndex: 1,
        overflow: "visible",
      }}
    >
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
          willChange: "transform",
        }}
      >
        <path
          ref={pathRef}
          d="
            M 50 0
            C 50 80, 15 120, 50 180
            S 85 240, 50 300
            C 15 360, 85 420, 50 480
            S 15 540, 50 600
            C 85 660, 15 720, 50 780
            S 85 840, 50 900
            C 15 960, 50 1000, 50 1000
          "
          fill="none"
          stroke="#C4D600"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.7"
          style={{ willChange: "stroke-dashoffset" }}
        />
      </svg>
    </div>
  );
};

export default GreenLifeLine;
