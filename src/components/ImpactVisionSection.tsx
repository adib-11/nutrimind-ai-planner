import { motion } from "framer-motion";
import { TrendingUp, Tag, Clock, DollarSign } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  delay: number;
}

const ImpactStatCard = ({ icon: Icon, title, value, description, delay }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-card rounded-2xl p-6 shadow-card"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-lime-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const ImpactVisionSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      title: "Dietary Compliance",
      value: "35%",
      description: "Expected increase in dietary compliance for NCD patients.",
    },
    {
      icon: Tag,
      title: "Food Expenditure",
      value: "15-20%",
      description: "Anticipated reduction in weekly food expenditure.",
    },
    {
      icon: Clock,
      title: "Time Saved",
      value: "6.3M Hours",
      description: "Expected time saved annually by users (Year 5).",
    },
    {
      icon: DollarSign,
      title: "Local Revenue",
      value: "৳551 Lakhs",
      description: "Projected Annual Revenue by Year 3.",
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
          <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
            Latest Priorities
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Impact & Vision
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Stats Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <ImpactStatCard
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  description={stat.description}
                  delay={0.2 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Vision */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex-1 lg:max-w-md"
          >
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImpactVisionSection;
