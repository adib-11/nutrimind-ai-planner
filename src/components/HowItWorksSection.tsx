import { motion } from "framer-motion";
import { Settings, Sparkles, Heart } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  icon: LucideIcon;
  step: number;
  title: string;
  description: string;
  delay: number;
}

const StepCard = ({ icon: Icon, step, title, description, delay }: StepCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
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
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Settings,
      title: "Setup Your Profile",
      description: "Share health goals, preferences, and dietary restrictions, or upload a prescription for analysis.",
    },
    {
      icon: Sparkles,
      title: "Get Your Smart Plan",
      description: "AI swiftly generates a weekly meal plan, optimizing for nutrition, budget, and local availability.",
    },
    {
      icon: Heart,
      title: "Eat & Thrive",
      description: "Enjoy delicious, local-food-centric meals and track your progress daily to achieve your health goals.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works: Your 3-Step Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Getting started with NutriMind is simple and takes just minutes.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <StepCard
              key={index}
              icon={step.icon}
              step={index + 1}
              title={step.title}
              description={step.description}
              delay={0.2 + index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
