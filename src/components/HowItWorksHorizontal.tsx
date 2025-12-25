import { useRef } from "react";
import { Settings, Sparkles, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: Settings,
    step: 1,
    title: "Setup Your Profile",
    description:
      "Share health goals, preferences, and dietary restrictions, or upload a prescription for analysis.",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Sparkles,
    step: 2,
    title: "Get Your Smart Plan",
    description:
      "AI swiftly generates a weekly meal plan, optimizing for nutrition, budget, and local availability.",
    color: "from-orange/20 to-orange/5",
  },
  {
    icon: Heart,
    step: 3,
    title: "Eat & Thrive",
    description:
      "Enjoy delicious, local-food-centric meals and track your progress daily to achieve your health goals.",
    color: "from-green-wallet/20 to-green-wallet/5",
  },
];

const HowItWorksHorizontal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current || !horizontalRef.current) return;

    const horizontalScrollLength = horizontalRef.current.scrollWidth - window.innerWidth;

    gsap.to(horizontalRef.current, {
      x: -horizontalScrollLength,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${horizontalScrollLength}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-secondary overflow-hidden"
    >
      <div
        ref={containerRef}
        className="h-screen flex items-center overflow-hidden"
      >
        <div
          ref={horizontalRef}
          className="flex items-center gap-8 px-8 lg:px-16"
          style={{ willChange: "transform" }}
        >
          {/* Intro Card */}
          <div className="flex-shrink-0 w-screen lg:w-[50vw] h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-xl">
              <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4">
                How It Works
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
                Your 3-Step Journey to{" "}
                <span className="text-primary">Better Health</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Getting started with NutriMind is simple and takes just minutes.
              </p>
              <div className="flex items-center justify-center gap-2 mt-8">
                <span className="text-muted-foreground">Scroll</span>
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center animate-pulse">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Step Cards */}
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-screen lg:w-[50vw] h-[70vh] flex items-center justify-center px-4"
            >
              <div
                className={`relative bg-gradient-to-br ${step.color} backdrop-blur-md border border-border/50 rounded-[2rem] p-8 lg:p-12 max-w-lg w-full h-full max-h-[500px] flex flex-col justify-center shadow-card`}
              >
                {/* Step number */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xl">{step.step}</span>
                </div>

                {/* Icon */}
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>

                {/* Progress dots */}
                <div className="flex gap-3 mt-8">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === index
                          ? "bg-primary w-8"
                          : "bg-primary/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Spacer for smooth end */}
          <div className="flex-shrink-0 w-[10vw]" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHorizontal;
