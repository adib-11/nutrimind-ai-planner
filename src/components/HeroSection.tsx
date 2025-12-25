import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayCircle, Flame, Wallet } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import foodPlate from "@/assets/food-plate.png";
import leaf1 from "@/assets/leaf-1.png";
import leaf2 from "@/assets/leaf-2.png";
import leaf3 from "@/assets/leaf-3.png";

gsap.registerPlugin(useGSAP);

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLImageElement>(null);
  const squircleRef = useRef<HTMLDivElement>(null);
  const caloriesCardRef = useRef<HTMLDivElement>(null);
  const budgetCardRef = useRef<HTMLDivElement>(null);
  const leaf1Ref = useRef<HTMLImageElement>(null);
  const leaf2Ref = useRef<HTMLImageElement>(null);
  const leaf3Ref = useRef<HTMLImageElement>(null);
  const leaf4Ref = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Content entrance animation
      gsap.from(contentRef.current?.children || [], {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2
      });

      // Squircle entrance
      gsap.from(squircleRef.current, {
        scale: 0.6,
        opacity: 0,
        duration: 1,
        ease: "back.out(1.4)",
        delay: 0.3
      });

      // Plate entrance with spin
      gsap.from(plateRef.current, {
        scale: 0.8,
        opacity: 0,
        rotation: -15,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.5
      });

      // Stat cards entrance
      gsap.from(caloriesCardRef.current, {
        scale: 0.8,
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: "back.out(1.5)",
        delay: 0.8
      });

      gsap.from(budgetCardRef.current, {
        scale: 0.8,
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: "back.out(1.5)",
        delay: 1
      });

      // Leaves entrance
      const leaves = [leaf1Ref.current, leaf2Ref.current, leaf3Ref.current, leaf4Ref.current];
      leaves.forEach((leaf, i) => {
        gsap.from(leaf, {
          scale: 0,
          opacity: 0,
          rotation: -30,
          duration: 0.8,
          ease: "back.out(2)",
          delay: 0.9 + i * 0.1
        });
      });

      // Idle floating animations
      gsap.to(plateRef.current, {
        y: 15,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(squircleRef.current, {
        y: 10,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });

      gsap.to(caloriesCardRef.current, {
        y: 12,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.3
      });

      gsap.to(budgetCardRef.current, {
        y: 10,
        duration: 2.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5
      });

      // Leaves idle float
      leaves.forEach((leaf, i) => {
        gsap.to(leaf, {
          y: 8 + i * 3,
          rotation: `+=${5 + i * 2}`,
          duration: 3 + i * 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      // Plate moves opposite to mouse (resistance)
      gsap.to(plateRef.current, {
        x: -deltaX * 25,
        y: -deltaY * 20,
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.to(squircleRef.current, {
        x: -deltaX * 15,
        y: -deltaY * 12,
        duration: 0.9,
        ease: "power2.out"
      });

      // Stat cards move with mouse at a lag (depth)
      gsap.to(caloriesCardRef.current, {
        x: deltaX * 20,
        y: deltaY * 15,
        duration: 1,
        ease: "power2.out"
      });

      gsap.to(budgetCardRef.current, {
        x: deltaX * 25,
        y: deltaY * 18,
        duration: 1.1,
        ease: "power2.out"
      });

      // Leaves move faster (foreground depth)
      const leaves = [leaf1Ref.current, leaf2Ref.current, leaf3Ref.current, leaf4Ref.current];
      leaves.forEach((leaf, i) => {
        gsap.to(leaf, {
          x: deltaX * (40 + i * 10),
          y: deltaY * (35 + i * 8),
          duration: 0.6 + i * 0.1,
          ease: "power2.out"
        });
      });
    };

    containerRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      containerRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-background overflow-hidden pt-20 lg:pt-0"
    >
      {/* Floating Leaves */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          ref={leaf1Ref}
          src={leaf1}
          alt=""
          className="absolute top-16 left-8 lg:top-20 lg:left-12 w-20 h-20 lg:w-28 lg:h-28 blur-[6px] opacity-70"
        />
        <img
          ref={leaf2Ref}
          src={leaf2}
          alt=""
          className="absolute bottom-16 left-12 lg:bottom-24 lg:left-20 w-16 h-16 lg:w-22 lg:h-22 blur-[4px] opacity-75"
        />
        <img
          ref={leaf3Ref}
          src={leaf3}
          alt=""
          className="absolute top-20 right-8 lg:top-24 lg:right-12 w-16 h-16 lg:w-24 lg:h-24 blur-[4px] opacity-75"
        />
        <img
          ref={leaf4Ref}
          src={leaf1}
          alt=""
          className="absolute bottom-12 right-8 lg:bottom-20 lg:right-16 w-24 h-24 lg:w-32 lg:h-32 blur-[6px] opacity-70 rotate-180"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-screen gap-8 lg:gap-12 py-12 lg:py-0">
          {/* Left Column - Content */}
          <div ref={contentRef} className="flex-1 flex flex-col justify-center text-center lg:text-left">
            {/* Tagline */}
            <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4">
              Personalized Nutrition, Every Meal
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 text-balance">
              AI-Based Food Planner for{" "}
              <span className="text-primary">Health</span> &{" "}
              <span className="text-primary">Fitness</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              Personalized AI meal planning based on health, allergies, and budget.
              Built specifically for Bangladeshi cuisine and local ingredient availability.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth">Generate My Plan</Link>
              </Button>
              <button className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors duration-300 group">
                <PlayCircle
                  size={24}
                  className="text-primary group-hover:scale-110 transition-transform duration-300"
                />
                <span>How it Works</span>
              </button>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Background Squircle Shape */}
            <div
              ref={squircleRef}
              className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] bg-primary rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
            />

            {/* Food Image */}
            <div className="relative z-10">
              <img
                ref={plateRef}
                src={foodPlate}
                alt="Delicious healthy meal - roasted chicken with vegetables"
                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] object-cover rounded-full shadow-float"
              />
            </div>

            {/* Floating Stats Cards */}
            <div
              ref={caloriesCardRef}
              className="absolute top-8 md:top-12 -left-4 md:-left-4 lg:-left-12 z-20"
            >
              <div className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 backdrop-blur-sm border border-border/50">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#f9731615" }}
                >
                  <Flame size={22} style={{ color: "#f97316" }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Calories</p>
                  <p className="text-base font-bold text-foreground">2327 kcal</p>
                </div>
              </div>
            </div>

            <div
              ref={budgetCardRef}
              className="absolute bottom-20 md:bottom-24 -right-4 md:-right-4 lg:-right-12 z-20"
            >
              <div className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 backdrop-blur-sm border border-border/50">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#22c55e15" }}
                >
                  <Wallet size={22} style={{ color: "#22c55e" }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Budget</p>
                  <p className="text-base font-bold text-foreground">৳250</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
