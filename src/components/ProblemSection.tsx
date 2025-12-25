import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const problemBubbles = [
  {
    text: "Western Apps ignore our food",
    position: "top-[15%] left-[10%]",
  },
  {
    text: "Dietitians are expensive (1:65,000 ratio)",
    position: "top-[25%] right-[10%]",
  },
  {
    text: "NCDs like Diabetes are rising",
    position: "bottom-[20%] left-1/2 -translate-x-1/2",
  },
];

const ProblemSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLDivElement | null)[]>([]);
  const answerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !textRef.current || !answerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Phase 1: Show main text
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

    // Phase 2: Fade in problem bubbles with stagger
    bubblesRef.current.forEach((bubble, index) => {
      if (bubble) {
        tl.fromTo(
          bubble,
          { opacity: 0, scale: 0.5, y: 30 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.2,
            ease: "back.out(1.7)"
          },
          `-=${0.1}`
        );
      }
    });

    // Hold for a moment
    tl.to({}, { duration: 0.5 });

    // Phase 3: Pop bubbles and fade out main text
    bubblesRef.current.forEach((bubble) => {
      if (bubble) {
        tl.to(
          bubble,
          { 
            opacity: 0, 
            scale: 1.5,
            duration: 0.15,
            ease: "power2.out"
          },
          "<"
        );
      }
    });

    tl.to(textRef.current, { opacity: 0, scale: 0.9, duration: 0.2 }, "-=0.1");

    // Phase 4: Show answer
    tl.fromTo(
      answerRef.current,
      { opacity: 0, scale: 0.8, y: 30 },
      { 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        duration: 0.3,
        ease: "power3.out"
      }
    );

    // Hold answer
    tl.to({}, { duration: 0.3 });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-secondary flex items-center justify-center overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-secondary pointer-events-none" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-primary/20 floating-bubble"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Question Text */}
        <div
          ref={textRef}
          className="text-center opacity-0"
        >
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Why NutriMind?
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
            Dieting in Bangladesh is{" "}
            <span className="text-primary">broken</span>...
          </h2>
        </div>

        {/* Problem Bubbles */}
        {problemBubbles.map((bubble, index) => (
          <div
            key={index}
            ref={(el) => (bubblesRef.current[index] = el)}
            className={`absolute ${bubble.position} opacity-0`}
          >
            <div className="bg-card/90 backdrop-blur-md border border-destructive/30 rounded-2xl px-6 py-4 shadow-card max-w-[250px] md:max-w-[300px]">
              <p className="text-sm md:text-base text-foreground font-medium text-center">
                {bubble.text}
              </p>
            </div>
          </div>
        ))}

        {/* Answer Text */}
        <div
          ref={answerRef}
          className="absolute inset-0 flex items-center justify-center opacity-0"
        >
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              <span className="text-primary">NutriMind</span> is the Answer.
            </h2>
            <p className="text-muted-foreground text-lg mt-4 max-w-xl mx-auto">
              AI-powered nutrition tailored for Bangladeshi cuisine, culture, and budget.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
