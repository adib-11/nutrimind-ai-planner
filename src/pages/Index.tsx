import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import ImpactVisionSection from "@/components/ImpactVisionSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  // Enable normalized scroll for buttery smooth experience
  useEffect(() => {
    ScrollTrigger.normalizeScroll(true);

    return () => {
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="cursor-none"
    >
      <Helmet>
        <title>NutriMind - AI-Based Food Planner for Health & Fitness</title>
        <meta
          name="description"
          content="Personalized AI meal planning based on health, allergies, and budget. Built specifically for Bangladeshi cuisine and local ingredient availability."
        />
        <meta property="og:title" content="NutriMind - AI Food Planner" />
        <meta
          property="og:description"
          content="Personalized nutrition, every meal. AI-powered meal planning for Bangladeshi cuisine."
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
      </Helmet>
      <CustomCursor />
      <main className="relative">
        <Navbar />
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <ImpactVisionSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>
    </motion.div>
  );
};

export default Index;
