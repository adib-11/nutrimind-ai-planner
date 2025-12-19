import { motion } from "framer-motion";
import leaf1 from "@/assets/leaf-1.png";
import leaf2 from "@/assets/leaf-2.png";
import leaf3 from "@/assets/leaf-3.png";

const FloatingLeaves = () => {
  return (
    <>
      {/* Top Left Leaf - Heavily blurred, close to camera - positioned to not overlap text */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-16 left-8 lg:top-20 lg:left-12 z-0 pointer-events-none"
      >
        <motion.img
          src={leaf1}
          alt=""
          className="w-20 h-20 lg:w-28 lg:h-28 blur-leaf-heavy opacity-70"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Bottom Left Leaf - Medium blur - positioned lower to avoid text */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-16 left-12 lg:bottom-24 lg:left-20 z-0 pointer-events-none"
      >
        <motion.img
          src={leaf2}
          alt=""
          className="w-16 h-16 lg:w-22 lg:h-22 blur-leaf opacity-75"
          animate={{
            y: [0, -10, 0],
            rotate: [0, -3, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </motion.div>

      {/* Top Right Leaf - Slight blur - positioned at edge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute top-20 right-8 lg:top-24 lg:right-12 z-0 pointer-events-none"
      >
        <motion.img
          src={leaf3}
          alt=""
          className="w-16 h-16 lg:w-24 lg:h-24 blur-leaf opacity-75"
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
      </motion.div>

      {/* Bottom Right Leaf - Heavy blur, positioned at corner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
        className="absolute bottom-12 right-8 lg:bottom-20 lg:right-16 z-0 pointer-events-none"
      >
        <motion.img
          src={leaf1}
          alt=""
          className="w-24 h-24 lg:w-32 lg:h-32 blur-leaf-heavy opacity-70 rotate-180"
          animate={{
            y: [0, -8, 0],
            rotate: [180, 175, 180],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </>
  );
};

export default FloatingLeaves;
