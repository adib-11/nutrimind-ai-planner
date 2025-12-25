import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utensils, Filter, Wallet } from "lucide-react";
import appMockup from "@/assets/app-mockup.png";

gsap.registerPlugin(ScrollTrigger);

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  phoneText: string;
  phoneSubtext?: string;
}

const features: FeatureItem[] = [
  {
    icon: <Utensils className="w-8 h-8 text-primary" />,
    title: "Authentic Local Food",
    description:
      "Our AI understands Bangladeshi cuisine. From Chicken Bhuna to Hilsa, we plan meals with ingredients you actually use.",
    phoneText: "Chicken Bhuna & Rice",
    phoneSubtext: "Traditional Recipe",
  },
  {
    icon: <Filter className="w-8 h-8 text-primary" />,
    title: "Smart Health Filters",
    description:
      "Managing diabetes, allergies, or specific health conditions? Our OCR reads prescriptions and adapts your meal plan automatically.",
    phoneText: "Diabetes Mode Active",
    phoneSubtext: "Low Glycemic Index",
  },
  {
    icon: <Wallet className="w-8 h-8 text-primary" />,
    title: "Budget Optimization",
    description:
      "Set your weekly budget and we'll plan nutritious meals that respect your wallet. No expensive imported ingredients required.",
    phoneText: "Budget Tracker: ৳250",
    phoneSubtext: "Weekly Budget: ৳2,500",
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

          {/* Right Column - CSS Sticky Phone */}
          <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen items-center justify-center">
            <div
              className="relative w-full max-w-[320px] h-[640px]"
              style={{ willChange: "transform" }}
            >
              {/* Phone frame */}
              <div className="relative w-full h-full rounded-[3rem] border-[8px] border-foreground/10 bg-card shadow-float overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-foreground/10 rounded-b-2xl z-20" />

                {/* App mockup */}
                <img
                  src={appMockup}
                  alt="NutriMind App"
                  className="w-full h-full object-cover"
                />

                {/* Dynamic overlay based on active feature */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/90 via-background/50 to-transparent transition-all duration-500">
                  <div className="absolute bottom-12 left-0 right-0 px-6">
                    <div
                      key={activeFeature}
                      className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-2xl p-5 shadow-card animate-fade-in"
                    >
                      <p className="text-primary font-bold text-lg">
                        {features[activeFeature]?.phoneText}
                      </p>
                      {features[activeFeature]?.phoneSubtext && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {features[activeFeature].phoneSubtext}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-10 bg-primary/10 rounded-full blur-3xl -z-10 opacity-50" />
            </div>
          </div>

          {/* Mobile phone (non-sticky) */}
          <div className="lg:hidden flex justify-center py-10">
            <div className="relative w-full max-w-[280px] h-[560px]">
              <div className="relative w-full h-full rounded-[2.5rem] border-[6px] border-foreground/10 bg-card shadow-float overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-foreground/10 rounded-b-xl z-20" />
                <img
                  src={appMockup}
                  alt="NutriMind App"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSectionPinned;
