import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  condition: string;
  quote: string;
  avatar: string;
  delay: number;
}

const TestimonialCard = ({ name, condition, quote, avatar, delay }: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="bg-card rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-foreground leading-relaxed mb-6">"{quote}"</p>
      
      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-lime-light flex items-center justify-center text-lg font-bold text-primary">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-primary font-medium">{condition}</p>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Fatima Rahman",
      condition: "Diabetes Management",
      quote: "NutriMind helped me control my blood sugar levels with meal plans that actually use foods I love. My HbA1c dropped from 8.2 to 6.5 in just 4 months!",
      avatar: "FR",
    },
    {
      name: "Karim Ahmed",
      condition: "Weight Loss Journey",
      quote: "Lost 15kg in 6 months without feeling hungry. The local recipes made it sustainable—I'm eating better deshi food than ever before!",
      avatar: "KA",
    },
    {
      name: "Nusrat Jahan",
      condition: "Budget-Conscious Family",
      quote: "As a mother of three, meal planning was a nightmare. Now I save ৳2000 weekly and my kids actually enjoy healthy meals. Game changer!",
      avatar: "NJ",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background layer - below the life line */}
      <div className="absolute inset-0 bg-background" style={{ zIndex: 1 }} />
      
      {/* Decorative Leaves - above bg, below life line */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-lime-light rounded-full opacity-30 blur-2xl" style={{ zIndex: 2 }} />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-lime-light rounded-full opacity-30 blur-2xl" style={{ zIndex: 2 }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative" style={{ zIndex: 15 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Real Results,<br className="sm:hidden" /> Healthy Journey
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear a few of our success stories.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              condition={testimonial.condition}
              quote={testimonial.quote}
              avatar={testimonial.avatar}
              delay={0.2 + index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
