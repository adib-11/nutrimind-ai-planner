import { motion } from "framer-motion";

// SVG Components for transparent food decorations
const AvocadoSVG = () => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="50" cy="65" rx="40" ry="50" fill="#8BC34A"/>
    <ellipse cx="50" cy="65" rx="35" ry="45" fill="#9CCC65"/>
    <ellipse cx="50" cy="70" rx="25" ry="30" fill="#C5E1A5"/>
    <ellipse cx="50" cy="75" rx="12" ry="15" fill="#5D4037"/>
  </svg>
);

const LemonSVG = () => (
  <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="50" cy="40" rx="45" ry="35" fill="#FDD835"/>
    <ellipse cx="50" cy="40" rx="40" ry="30" fill="#FFEB3B"/>
    <ellipse cx="30" cy="35" rx="8" ry="12" fill="#FFF9C4" opacity="0.6"/>
  </svg>
);

const LeafSVG = () => (
  <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M40 5 Q60 20 65 50 Q60 80 40 95 Q20 80 15 50 Q20 20 40 5Z" fill="#66BB6A"/>
    <path d="M40 15 Q55 28 58 50 Q55 72 40 85 Q25 72 22 50 Q25 28 40 15Z" fill="#81C784"/>
    <path d="M40 15 L40 90" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round"/>
    <path d="M40 35 Q30 45 25 50" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
    <path d="M40 35 Q50 45 55 50" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
    <path d="M40 55 Q30 65 25 70" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
    <path d="M40 55 Q50 65 55 70" stroke="#4CAF50" strokeWidth="1.5" fill="none"/>
  </svg>
);

const OrangeSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="50" r="45" fill="#FF9800"/>
    <circle cx="50" cy="50" r="40" fill="#FFA726"/>
    <circle cx="35" cy="35" rx="10" ry="12" fill="#FFB74D" opacity="0.7"/>
    <path d="M50 10 Q55 5 60 8" stroke="#4CAF50" strokeWidth="3" fill="none"/>
  </svg>
);

const TomatoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="55" r="40" fill="#E53935"/>
    <circle cx="50" cy="55" r="36" fill="#EF5350"/>
    <ellipse cx="35" cy="45" rx="8" ry="10" fill="#FFCDD2" opacity="0.5"/>
    <path d="M40 18 Q50 12 60 18" stroke="#4CAF50" strokeWidth="4" fill="none"/>
    <path d="M45 20 Q50 8 55 20" stroke="#66BB6A" strokeWidth="3" fill="none"/>
  </svg>
);

const CarrotSVG = () => (
  <svg viewBox="0 0 60 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M30 25 Q45 35 40 70 Q35 110 30 115 Q25 110 20 70 Q15 35 30 25Z" fill="#FF7043"/>
    <path d="M30 30 Q40 38 36 68 Q33 100 30 105 Q27 100 24 68 Q20 38 30 30Z" fill="#FF8A65"/>
    <path d="M25 10 Q30 0 35 10 L35 28 Q30 35 25 28 Z" fill="#66BB6A"/>
    <path d="M20 12 Q25 5 28 15 L28 25 Q25 30 20 25 Z" fill="#81C784"/>
    <path d="M40 12 Q35 5 32 15 L32 25 Q35 30 40 25 Z" fill="#81C784"/>
  </svg>
);

const LimeSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="50" cy="50" r="45" fill="#7CB342"/>
    <circle cx="50" cy="50" r="40" fill="#8BC34A"/>
    <ellipse cx="35" cy="40" rx="8" ry="10" fill="#C5E1A5" opacity="0.6"/>
  </svg>
);

const FloatingFoodDecorations = () => {
  return (
    <>
      {/* Bottom Left - Large Avocado - Partially visible at edge */}
      <motion.div
        className="fixed -bottom-8 -left-8 w-48 md:w-72 opacity-70 pointer-events-none z-0"
        animate={{
          y: [0, -20, 0],
          rotate: [-5, 5, -5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <AvocadoSVG />
      </motion.div>

      {/* Top Right - Large Orange - Partially visible at edge */}
      <motion.div
        className="fixed -top-10 -right-10 w-44 md:w-64 opacity-60 pointer-events-none z-0"
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <OrangeSVG />
      </motion.div>

      {/* Left Middle - Leaf */}
      <motion.div
        className="fixed top-1/3 -left-4 w-28 md:w-40 opacity-60 pointer-events-none z-0"
        animate={{
          y: [0, -15, 0],
          rotate: [-10, 10, -10],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <LeafSVG />
      </motion.div>

      {/* Bottom Right - Tomato */}
      <motion.div
        className="fixed -bottom-6 right-8 md:right-16 w-36 md:w-52 opacity-55 pointer-events-none z-0"
        animate={{
          y: [0, -12, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
      >
        <TomatoSVG />
      </motion.div>

      {/* Top Left - Carrot (tilted) */}
      <motion.div
        className="fixed top-8 left-4 md:left-12 w-24 md:w-36 opacity-50 pointer-events-none z-0 -rotate-45"
        animate={{
          y: [0, -10, 0],
          rotate: [-45, -40, -45],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      >
        <CarrotSVG />
      </motion.div>

      {/* Right Middle - Lemon */}
      <motion.div
        className="fixed top-1/2 -right-6 w-32 md:w-44 opacity-50 pointer-events-none z-0"
        animate={{
          x: [0, -10, 0],
          rotate: [10, -5, 10],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
      >
        <LemonSVG />
      </motion.div>

      {/* Bottom Center-Left - Lime */}
      <motion.div
        className="fixed bottom-1/4 left-4 w-20 md:w-28 opacity-45 pointer-events-none z-0"
        animate={{
          y: [0, -8, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
      >
        <LimeSVG />
      </motion.div>

      {/* Top Center - Small leaf accent */}
      <motion.div
        className="fixed top-4 left-1/3 w-16 md:w-24 opacity-40 pointer-events-none z-0 rotate-45"
        animate={{
          y: [0, -6, 0],
          rotate: [45, 55, 45],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      >
        <LeafSVG />
      </motion.div>
    </>
  );
};

export default FloatingFoodDecorations;
