import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Sparkles, Users, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  yearlyPrice?: string;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonVariant: "outline" | "hero";
  isPopular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free Tier",
    price: "BDT 0",
    period: "/month",
    icon: <Leaf className="w-6 h-6 text-primary" />,
    features: [
      "3 meal suggestions/week",
      "Basic calorie tracking",
      "Limited to 30 recipes",
      "Ad-supported",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Premium Individual",
    price: "BDT 199",
    period: "/month",
    yearlyPrice: "or BDT 1,999/year",
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    features: [
      "Full AI personalization",
      "Unlimited meal plans",
      "Prescription analysis (OCR)",
      "Budget optimization",
      "No ads",
    ],
    buttonText: "Subscribe Now",
    buttonVariant: "hero",
    isPopular: true,
  },
  {
    name: "Family Plan",
    price: "BDT 399",
    period: "/month",
    yearlyPrice: "or BDT 3,999/year",
    icon: <Users className="w-6 h-6 text-primary" />,
    features: [
      "Up to 4 members",
      "Full AI personalization",
      "Unlimited meal plans",
      "Prescription analysis (OCR)",
      "Budget optimization",
      "No ads",
    ],
    buttonText: "Choose Family",
    buttonVariant: "outline",
  },
];

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = cardsRef.current?.children;
    if (!cards) return;

    gsap.from(cards, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      y: 80,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-20 lg:py-32 bg-background relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Pricing Plans
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
            Choose Your <span className="text-primary">Plan</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start free and upgrade when you're ready. All plans include access
            to our AI-powered meal planning technology.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch"
        >
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-card/80 backdrop-blur-md border border-border/50 rounded-3xl p-6 lg:p-8 flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 ${
                plan.isPopular
                  ? "md:scale-105 md:-my-4 shadow-float border-primary/30"
                  : "shadow-card"
              }`}
              style={{ willChange: "transform" }}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Recommended
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                {plan.icon}
              </div>

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
                {plan.yearlyPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.yearlyPrice}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-foreground"
                  >
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={plan.buttonVariant}
                size="lg"
                className={`w-full ${
                  plan.buttonVariant === "outline"
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : ""
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
