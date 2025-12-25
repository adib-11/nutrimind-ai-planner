import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utensils, Filter, Wallet, Check } from "lucide-react";
import foodPlate from "@/assets/food-plate.png";

gsap.registerPlugin(ScrollTrigger);

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  dashboardContent: "food" | "filter" | "budget";
}

const features: FeatureItem[] = [
  {
    icon: <Utensils className="w-8 h-8 text-primary" />,
    title: "Authentic Local Food",
    description:
      "Our AI understands Bangladeshi cuisine. From Chicken Bhuna to Hilsa, we plan meals with ingredients you actually use.",
    dashboardContent: "food",
  },
  {
    icon: <Filter className="w-8 h-8 text-primary" />,
    title: "Smart Health Filters",
    description:
      "Managing diabetes, allergies, or specific health conditions? Our OCR reads prescriptions and adapts your meal plan automatically.",
    dashboardContent: "filter",
  },
  {
    icon: <Wallet className="w-8 h-8 text-primary" />,
    title: "Budget Optimization",
    description:
      "Set your weekly budget and we'll plan nutritious meals that respect your wallet. No expensive imported ingredients required.",
    dashboardContent: "budget",
  },
];

const FeaturesSectionPinned = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Create ScrollTriggers for each feature text block
    featureRefs.current.forEach((feature, index) => {
      if (!feature) return;

      const trigger = ScrollTrigger.create({
        trigger: feature,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => setActiveFeature(index),
        onEnterBack: () => setActiveFeature(index),
      });
      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative bg-background"
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="text-center py-20">
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Designed for <span className="text-primary">You</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every feature is crafted to make healthy eating effortless and enjoyable.
          </p>
        </div>

        {/* Hybrid Sticky Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-16">
          {/* Left Column - Scrolling Text */}
          <div className="lg:w-1/2 py-[10vh]">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (featureRefs.current[index] = el)}
                className="mb-[50vh] last:mb-[20vh]"
              >
                <div
                  className={`bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-8 lg:p-10 transition-all duration-500 ${
                    activeFeature === index
                      ? "opacity-100 translate-x-0"
                      : "opacity-40 -translate-x-4"
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Floating Web Dashboard */}
          <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen items-center justify-center">
            <div
              className="relative w-full max-w-[600px] aspect-video"
              style={{ willChange: "transform" }}
            >
              {/* Glass Card Dashboard */}
              <div className="relative w-full h-full rounded-xl border-2 border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30 bg-muted/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                      nutrimind.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 h-[calc(100%-48px)] flex items-center justify-center">
                  {/* Food Content */}
                  {features[activeFeature]?.dashboardContent === "food" && (
                    <div key="food" className="animate-fade-in w-full">
                      <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-card">
                        <div className="flex items-center gap-4">
                          <div className="w-24 h-24 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
                            <img src={foodPlate} alt="Chicken Bhuna" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-foreground">Chicken Bhuna & Rice</h4>
                            <p className="text-muted-foreground text-sm mt-1">Traditional Bangladeshi Recipe</p>
                            <div className="flex gap-2 mt-3">
                              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">450 kcal</span>
                              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">35g Protein</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filter Content */}
                  {features[activeFeature]?.dashboardContent === "filter" && (
                    <div key="filter" className="animate-fade-in w-full">
                      <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-card">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-foreground">Health Filters</h4>
                          <span className="px-3 py-1 bg-green-500/20 text-green-600 text-xs font-semibold rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-xl border border-primary/30">
                            <span className="font-medium text-foreground">Diabetes Mode</span>
                            <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                              <div className="w-4 h-4 bg-background rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                            <span className="text-muted-foreground">Low Glycemic Index</span>
                            <Check className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Content */}
                  {features[activeFeature]?.dashboardContent === "budget" && (
                    <div key="budget" className="animate-fade-in w-full">
                      <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-card">
                        <h4 className="text-lg font-bold text-foreground mb-4">Daily Budget Tracker</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Today's Spending</span>
                              <span className="font-bold text-foreground">৳180 / ৳250</span>
                            </div>
                            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500" style={{ width: "72%" }} />
                            </div>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-muted-foreground">Weekly Budget</span>
                            <span className="text-primary font-bold">৳1,260 / ৳2,500</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50" />
            </div>
          </div>

          {/* Mobile Dashboard (non-sticky) */}
          <div className="lg:hidden flex justify-center py-10">
            <div className="relative w-full max-w-[320px] aspect-video rounded-xl border-2 border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border/30 bg-muted/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">NutriMind Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionPinned;
