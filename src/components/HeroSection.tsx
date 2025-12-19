import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlayCircle, Flame, Wallet } from "lucide-react";
import StatCard from "./StatCard";
import FloatingLeaves from "./FloatingLeaves";
import foodPlate from "@/assets/food-plate.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden pt-20 lg:pt-0">
      {/* Floating Leaves for depth effect */}
      <FloatingLeaves />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-screen gap-8 lg:gap-12 py-12 lg:py-0">
          {/* Left Column - Content */}
          <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xs lg:text-sm font-bold uppercase tracking-widest text-primary mb-4"
            >
              Personalized Nutrition, Every Meal
            </motion.p>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6 text-balance"
            >
              AI-Based Food Planner for{" "}
              <span className="text-primary">Health</span> &{" "}
              <span className="text-primary">Fitness</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-base lg:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Personalized AI meal planning based on health, allergies, and budget.
              Built specifically for Bangladeshi cuisine and local ingredient availability.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
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
            </motion.div>
          </div>

          {/* Right Column - Visual */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* Background Squircle Shape */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] lg:w-[450px] lg:h-[450px] bg-primary rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%]"
            />

            {/* Food Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative z-10"
            >
              <img
                src={foodPlate}
                alt="Delicious healthy meal - roasted chicken with vegetables"
                className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] object-cover rounded-full shadow-float"
              />
            </motion.div>

            {/* Floating Stats Cards */}
            <div className="absolute top-8 md:top-12 -left-4 md:-left-4 lg:-left-12 z-20">
              <StatCard
                icon={Flame}
                iconColor="#f97316"
                label="Calories"
                value="2327 kcal"
                delay={0.7}
              />
            </div>

            <div className="absolute bottom-20 md:bottom-24 -right-4 md:-right-4 lg:-right-12 z-20">
              <StatCard
                icon={Wallet}
                iconColor="#22c55e"
                label="Budget"
                value="৳250"
                delay={0.9}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
