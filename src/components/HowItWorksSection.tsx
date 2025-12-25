import { useRef } from "react";
import { Settings, Sparkles, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StepCardProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  cardRef: React.RefObject<HTMLDivElement>;
}

const StepCard = ({ icon: Icon, step, title, description, cardRef }: StepCardProps) => {
  return (
    <div
      ref={cardRef}
      className="bg-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 opacity-0"
    >
      <div className="flex flex-col items-center text-center">
        {/* Step Number */}
        <span className="text-sm font-semibold text-primary mb-4">Step {step}</span>
        
        {/* Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-lime-light flex items-center justify-center mb-6">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        
        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  const steps = [
    {
      icon: Settings,
      title: "Setup Your Profile",
      description: "Share health goals, preferences, and dietary restrictions, or upload a prescription for analysis.",
      cardRef: card1Ref,
    },
    {
      icon: Sparkles,
      title: "Get Your Smart Plan",
      description: "AI swiftly generates a weekly meal plan, optimizing for nutrition, budget, and local availability.",
      cardRef: card2Ref,
    },
    {
      icon: Heart,
      title: "Eat & Thrive",
      description: "Enjoy delicious, local-food-centric meals and track your progress daily to achieve your health goals.",
      cardRef: card3Ref,
    },
  ];

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from(headerRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });

      // Cards stagger animation
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current];
      
      cards.forEach((card, index) => {
        gsap.fromTo(card, 
          { 
            y: 100, 
            opacity: 0,
            scale: 0.9
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none none"
            },
            delay: index * 0.2
          }
        );
      });

      // Line draw animation
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 50%",
            toggleActions: "play none none none"
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works: Your 3-Step Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Getting started with NutriMind is simple and takes just minutes.
          </p>
        </div>

        {/* Connecting Line SVG (Desktop only) */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-4 hidden md:block"
          style={{ marginTop: "60px" }}
        >
          <path
            ref={lineRef}
            d="M 0 8 Q 200 8 400 8 T 800 8"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              step={index + 1}
              title={step.title}
              description={step.description}
              cardRef={step.cardRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
