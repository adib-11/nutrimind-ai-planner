import { useRef, useEffect, useState } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Quick setters for instant tracking
    const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const cursorY = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      cursorX(e.clientX);
      cursorY(e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Hover detection for interactive elements
    const handleElementHover = () => setIsHovering(true);
    const handleElementLeave = () => setIsHovering(false);

    // Add listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, [role='button'], input, textarea, select, [data-cursor-hover]"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
    };
  }, [isVisible]);

  // Update hover state animation
  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      scale: isHovering ? 1.2 : 1,
      duration: 0.2,
      ease: "power2.out",
    });
  }, [isHovering]);

  // Hide on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{
        opacity: isVisible ? 1 : 0,
        willChange: "transform",
        transform: "translate(-4px, -2px)",
      }}
    >
      {isHovering ? (
        // Hand pointer on hover
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hand/pointer icon */}
          <path
            d="M17 8V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v13l-2.3-2.3a2 2 0 0 0-2.83 0 2 2 0 0 0 0 2.83L14 24c1.1 1.1 2.6 1.7 4.2 1.7H21a6 6 0 0 0 6-6v-4.5a2.5 2.5 0 0 0-2.5-2.5 2.5 2.5 0 0 0-2.5 2.5V14a2 2 0 0 0-2-2 2 2 0 0 0-2 2v-2a2 2 0 0 0-2-2 2 2 0 0 0-2 2v-2a2 2 0 0 0 3-2Z"
            fill="hsl(68, 100%, 42%)"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Sharp arrow pointer (default)
        <svg
          width="28"
          height="32"
          viewBox="0 0 28 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Sharp triangular arrow */}
          <path
            d="M4 2L4 26L10 20L16 30L20 28L14 18L24 18L4 2Z"
            fill="hsl(68, 100%, 42%)"
            stroke="#000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
};

export default CustomCursor;
