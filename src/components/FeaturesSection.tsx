import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import appMockup from "@/assets/app-mockup.png";

const features = [
  {
    title: "Prescription & Allergy Analysis",
    description: "OCR tech extracts diet constraints directly from prescriptions.",
  },
  {
    title: "Google OR-Tools",
    description: "Advanced Constraint Programming ensures optimal nutrition & budget are met.",
  },
  {
    title: "500+ Bangladeshi Recipes",
    description: "Our proprietary database supports authentic local meals, unlike generic apps.",
  },
  {
    title: "Smart Substitutions",
    description: "Suggests lower-cost, seasonal, or available alternatives to reduce food waste.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column - Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">
                Smart & Local Edge
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Intelligent Planning, Local Focus
              </h2>
            </motion.div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative">
              {/* Phone Frame */}
              <div className="relative w-[280px] md:w-[320px] rounded-[40px] bg-foreground p-3 shadow-float">
                <div className="rounded-[32px] overflow-hidden bg-background">
                  <img
                    src={appMockup}
                    alt="NutriMind App - Personalized meal planning interface"
                    className="w-full h-auto"
                  />
                </div>
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground rounded-b-2xl" />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[420px] md:h-[420px] bg-lime-light rounded-full opacity-50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
