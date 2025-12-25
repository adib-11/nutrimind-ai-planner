import { useRef } from "react";
import { CheckCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import appMockup from "@/assets/app-mockup.png";

// Ingredient images (using emoji placeholders - you can replace with actual PNGs)
const ingredients = [
  { emoji: "🌶️", left: "55%", delay: 0 },
  { emoji: "🧅", left: "65%", delay: 0.3 },
  { emoji: "🧄", left: "75%", delay: 0.6 },
  { emoji: "🥕", left: "60%", delay: 0.4 },
  { emoji: "🍅", left: "70%", delay: 0.2 },
];

gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    title: "Prescription & Allergy Analysis",
    description: "OCR tech extracts diet constraints directly from prescriptions.",
  },
  {
    title: "Google OR-Tools",
    description: "Advanced Constraint Programming ensures optimal nutrition & budget are met.",
  },
  {
    title: "500+ Bangladeshi Recipes",
    description: "Our proprietary database supports authentic local meals, unlike generic apps.",
  },
  {
    title: "Smart Substitutions",
    description: "Suggests lower-cost, seasonal, or available alternatives to reduce food waste.",
  },
];

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const featuresListRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const ingredientRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(headerRef.current?.children || [], {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      // Features list animation
      gsap.from(featuresListRef.current?.children || [], {
        x: -40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: featuresListRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      // Mockup parallax effect
      gsap.to(mockupRef.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Entrance animation for mockup
      gsap.from(mockupRef.current, {
        scale: 0.85,
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: mockupRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      // Ingredient rain animation
      ingredientRefs.current.forEach((ingredient, index) => {
        if (!ingredient) return;
        
        gsap.fromTo(ingredient, 
          { 
            y: -100,
            opacity: 0,
            rotation: -20
          },
          {
            y: 500,
            opacity: 1,
            rotation: 20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1 + index * 0.2
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Ingredient Rain (behind the mockup) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ingredients.map((ing, index) => (
          <div
            key={index}
            ref={(el) => (ingredientRefs.current[index] = el)}
            className="absolute text-4xl md:text-5xl opacity-40"
            style={{ left: ing.left, top: "-50px" }}
          >
            {ing.emoji}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div className="flex-1">
            <div ref={headerRef}>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Smart & Local Edge
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Intelligent Planning, Local Focus
              </h2>
            </div>

            {/* Features List */}
            <div ref={featuresListRef} className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Mobile Mockup */}
          <div className="flex-1 flex justify-center relative z-10">
            <div ref={mockupRef} className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] md:w-[320px] rounded-[40px] bg-foreground p-3 shadow-float">
                <div className="rounded-[32px] overflow-hidden bg-background">
                  <img
                    src={appMockup}
                    alt="NutriMind App - Personalized meal planning interface"
                    className="w-full h-auto"
                  />
                </div>
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[420px] md:h-[420px] bg-lime-light rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
