import { useRef, useEffect } from "react";
import { CalendarDays, Sparkles, Wallet, Lightbulb, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Dashboard = () => {
  const budgetUsed = 180;
  const budgetTotal = 250;
  const budgetProgress = (budgetUsed / budgetTotal) * 100;

  // Refs for GSAP targeting
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const budgetTextRef = useRef<HTMLSpanElement>(null);
  const riceBowlRef = useRef<HTMLImageElement>(null);
  const aiIconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ============================================
      // ANIMATION SEQUENCE 1: The "Grand Entrance"
      // ============================================
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // Welcome Banner entrance
      tl.fromTo(
        bannerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      );

      // Main Glass Container (Bento Grid) entrance
      tl.fromTo(
        bentoGridRef.current,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      );

      // Content Stagger - All cards in the grid
      const cards = containerRef.current?.querySelectorAll(".dashboard-card");
      if (cards) {
        tl.fromTo(
          cards,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.3"
        );
      }

      // ============================================
      // ANIMATION SEQUENCE 2: Budget Ring Animation
      // ============================================
      if (progressCircleRef.current) {
        const circumference = 2 * Math.PI * 42; // r=42
        const targetOffset = circumference - (budgetProgress / 100) * circumference;

        gsap.fromTo(
          progressCircleRef.current,
          { strokeDasharray: `0 ${circumference}` },
          {
            strokeDasharray: `${(budgetProgress / 100) * circumference} ${circumference}`,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.8,
          }
        );
      }

      // Number Counter Animation
      if (budgetTextRef.current) {
        gsap.fromTo(
          budgetTextRef.current,
          { textContent: 0 },
          {
            textContent: budgetUsed,
            duration: 1.5,
            ease: "power2.out",
            delay: 0.8,
            snap: { textContent: 1 },
            onUpdate: function () {
              if (budgetTextRef.current) {
                budgetTextRef.current.textContent = `৳${Math.round(
                  parseFloat(budgetTextRef.current.textContent?.replace("৳", "") || "0")
                )}`;
              }
            },
          }
        );
      }

      // ============================================
      // ANIMATION SEQUENCE 3: "Breathing" Micro-Interactions
      // ============================================
      // Rice Bowl floating effect
      if (riceBowlRef.current) {
        gsap.to(riceBowlRef.current, {
          y: -6,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // AI Icon floating effect
      if (aiIconRef.current) {
        gsap.to(aiIconRef.current, {
          y: -6,
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 0.5,
        });
      }

      // ============================================
      // ANIMATION SEQUENCE 4: Hover Physics
      // ============================================
      const hoverCards = containerRef.current?.querySelectorAll(".dashboard-card");
      hoverCards?.forEach((card) => {
        const htmlCard = card as HTMLElement;
        const originalShadow = getComputedStyle(htmlCard).boxShadow;

        htmlCard.addEventListener("mouseenter", () => {
          gsap.to(htmlCard, {
            y: -5,
            scale: 1.01,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
        });

        htmlCard.addEventListener("mouseleave", () => {
          gsap.to(htmlCard, {
            y: 0,
            scale: 1,
            boxShadow: originalShadow || "none",
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <MainLayout>
      <div ref={containerRef} className="flex-1 flex flex-col h-full">
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-auto pb-20 md:pb-8 h-full">
          {/* Welcome Banner */}
          <div
            ref={bannerRef}
            className="w-full bg-gradient-to-r from-[hsl(68,80%,75%)] to-[hsl(68,70%,85%)] rounded-3xl p-6 md:p-8 mb-6 flex items-center justify-between overflow-hidden relative flex-shrink-0"
          >
            <div className="z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Good Morning, User! 👋
              </h1>
              <p className="text-muted-foreground mt-2 text-base md:text-lg">
                Ready to fuel your body today?
              </p>
            </div>
            {/* Streak Counter */}
            <div className="hidden md:flex items-center gap-2 bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/30">
              <Flame className="text-orange-500" size={20} />
              <span className="font-bold text-foreground">5 Day Streak</span>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div ref={bentoGridRef} className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
            {/* Main Action Cards - Span 2 columns */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
              {/* Generate Meal Plan Card */}
              <div className="dashboard-card bg-background/90 backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 shadow-xl cursor-pointer flex flex-col h-full">
                {/* Image area - Healthy Rice Bowl */}
                <div className="h-40 md:h-48 bg-gradient-to-br from-[hsl(68,60%,90%)] to-[hsl(68,50%,80%)] flex items-center justify-center overflow-hidden relative flex-shrink-0">
                  <img
                    ref={riceBowlRef}
                    src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80"
                    alt="Healthy Rice Bowl"
                    className="w-full h-full object-cover mix-blend-multiply"
                  />
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Tag */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary w-fit mb-3">
                    Recommended for you
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                    <CalendarDays className="text-primary" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Generate Meal Plan
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    Get a weekly plan tailored to your budget & health goals.
                  </p>
                  <Link to="/meal-planner" className="w-full">
                    <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Create Plan
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Nutrition Chatbot Card */}
              <div className="dashboard-card bg-background/90 backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 shadow-xl cursor-pointer flex flex-col h-full">
                {/* Image area - AI Brain/Sparkles */}
                <div className="h-40 md:h-48 bg-gradient-to-br from-[hsl(270,60%,92%)] to-[hsl(280,50%,85%)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  <div ref={aiIconRef} className="relative">
                    <div className="w-24 h-24 rounded-full bg-background/50 flex items-center justify-center">
                      <Sparkles className="text-purple-500" size={48} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-400/50 animate-pulse" />
                    <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-purple-300/50 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  </div>
                </div>
                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Tag */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 w-fit mb-3">
                    24/7 Support
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Ask NutriMind AI
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4 flex-1">
                    Instant answers about calories, substitutions & nutrition.
                  </p>
                  <Link to="/chat" className="w-full">
                    <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Start Chat
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Widgets */}
            <div className="flex flex-col gap-6 h-full">
              {/* Daily Budget Tracker Widget */}
              <div className="dashboard-card bg-background/90 backdrop-blur-md rounded-3xl p-6 border border-border/40 shadow-lg flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Wallet className="text-primary" size={20} />
                  </div>
                  <h3 className="font-semibold text-foreground">Today's Budget</h3>
                </div>
                
                {/* Circular Progress */}
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-muted/30"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        ref={progressCircleRef}
                        className="text-primary"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        strokeDasharray="0 264"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span ref={budgetTextRef} className="text-lg font-bold text-foreground">৳0</span>
                      <span className="text-xs text-muted-foreground">of ৳{budgetTotal}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-sm text-muted-foreground">
                  ৳{budgetTotal - budgetUsed} remaining today
                </p>
              </div>

              {/* Daily Tip Widget */}
              <div className="dashboard-card bg-gradient-to-br from-[hsl(38,90%,95%)] to-[hsl(38,80%,88%)] backdrop-blur-md rounded-3xl p-6 border border-border/40 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Lightbulb className="text-amber-500" size={20} />
                  </div>
                  <h3 className="font-semibold text-foreground">Daily Tip</h3>
                </div>
                
                <p className="text-foreground/80 text-sm leading-relaxed">
                  💡 <strong>Did you know?</strong> Masoor dal provides 9g protein per 100g — perfect for affordable, nutritious meals!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
