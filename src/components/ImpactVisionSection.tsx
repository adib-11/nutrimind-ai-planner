import { useRef, useState } from "react";
import { TrendingUp, Tag, Clock, DollarSign } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  targetValue: number;
  suffix: string;
  prefix?: string;
  description: string;
  cardRef: React.RefObject<HTMLDivElement>;
  displayValue: string;
}

const ImpactStatCard = ({ 
  icon: Icon, 
  title, 
  description, 
  cardRef,
  displayValue
}: StatCardProps) => {
  return (
    <div
      ref={cardRef}
      className="bg-card rounded-2xl p-6 shadow-card opacity-0"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1 stat-value">{displayValue}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ImpactVisionSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  const [displayValues, setDisplayValues] = useState({
    stat1: "0%",
    stat2: "0%",
    stat3: "0M",
    stat4: "৳0"
  });

  const stats = [
    {
      icon: TrendingUp,
      title: "Dietary Compliance",
      targetValue: 35,
      suffix: "%",
      prefix: "",
      description: "Expected increase in dietary compliance for NCD patients.",
      cardRef: card1Ref,
      key: "stat1"
    },
    {
      icon: Tag,
      title: "Food Expenditure",
      targetValue: 17.5,
      suffix: "%",
      prefix: "",
      description: "Anticipated reduction in weekly food expenditure.",
      cardRef: card2Ref,
      key: "stat2"
    },
    {
      icon: Clock,
      title: "Time Saved",
      targetValue: 6.3,
      suffix: "M Hours",
      prefix: "",
      description: "Expected time saved annually by users (Year 5).",
      cardRef: card3Ref,
      key: "stat3"
    },
    {
      icon: DollarSign,
      title: "Local Revenue",
      targetValue: 551,
      suffix: " Lakhs",
      prefix: "৳",
      description: "Projected Annual Revenue by Year 3.",
      cardRef: card4Ref,
      key: "stat4"
    },
  ];

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

      // Cards entrance animation
      const cards = [card1Ref.current, card2Ref.current, card3Ref.current, card4Ref.current];
      
      cards.forEach((card, index) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            toggleActions: "play none none none"
          },
          delay: index * 0.15
        });

        gsap.set(card, {
          y: 40,
          scale: 0.95
        });
      });

      // Number counting animation
      const countTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        onEnter: () => {
          // Stat 1: 35%
          const obj1 = { val: 0 };
          gsap.to(obj1, {
            val: 35,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              setDisplayValues(prev => ({
                ...prev,
                stat1: `${Math.round(obj1.val)}%`
              }));
            }
          });

          // Stat 2: 15-20% (animate to 17.5, display as range)
          const obj2 = { val: 0 };
          gsap.to(obj2, {
            val: 20,
            duration: 2,
            ease: "power2.out",
            delay: 0.15,
            onUpdate: () => {
              const min = Math.round(obj2.val * 0.75);
              const max = Math.round(obj2.val);
              setDisplayValues(prev => ({
                ...prev,
                stat2: `${min}-${max}%`
              }));
            }
          });

          // Stat 3: 6.3M Hours
          const obj3 = { val: 0 };
          gsap.to(obj3, {
            val: 6.3,
            duration: 2,
            ease: "power2.out",
            delay: 0.3,
            onUpdate: () => {
              setDisplayValues(prev => ({
                ...prev,
                stat3: `${obj3.val.toFixed(1)}M Hours`
              }));
            }
          });

          // Stat 4: ৳551 Lakhs
          const obj4 = { val: 0 };
          gsap.to(obj4, {
            val: 551,
            duration: 2,
            ease: "power2.out",
            delay: 0.45,
            onUpdate: () => {
              setDisplayValues(prev => ({
                ...prev,
                stat4: `৳${Math.round(obj4.val)} Lakhs`
              }));
            }
          });
        },
        once: true
      });

      // Vision card animation
      gsap.from(visionRef.current, {
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: visionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      return () => countTrigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Latest Priorities
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Impact & Vision
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Stats Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <ImpactStatCard
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  targetValue={stat.targetValue}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  description={stat.description}
                  cardRef={stat.cardRef}
                  displayValue={displayValues[stat.key as keyof typeof displayValues]}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Vision */}
          <div ref={visionRef} className="flex-1 lg:max-w-md">
            <div className="bg-card rounded-3xl p-8 shadow-card h-full">
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Future</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We aim to become the therapeutic nutrition standard, launch AI-driven 
                one-click e-grocery integration, and replicate our low-cost, high-value 
                model across other South Asian LMICs.
              </p>
              <Button variant="hero" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisionSection;
