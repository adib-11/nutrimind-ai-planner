import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";
import FloatingFoodDecorations from "@/components/FloatingFoodDecorations";

interface MainLayoutProps {
  children: ReactNode;
  showDecorations?: boolean;
}

// Page content animation variants
const contentVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const MainLayout = ({ children, showDecorations = true }: MainLayoutProps) => {
  const location = useLocation();

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[hsl(68,60%,95%)] to-[hsl(68,50%,88%)] overflow-hidden flex">
      {/* Floating Decorative Elements */}
      {showDecorations && <FloatingFoodDecorations />}

      {/* Independent Sidebar - sits on the background */}
      <div className="relative z-20">
        <AppSidebar />
      </div>

      {/* Main Glass Card Container */}
      <div className="flex-1 p-4 md:my-4 md:mr-4 relative z-10">
        <div className="h-full w-full bg-background/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-border/50 overflow-hidden flex flex-col">
          <motion.div
            key={location.pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={contentVariants}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border/30 py-3 px-4 flex justify-around z-50">
        {mobileNavItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className="relative flex flex-col items-center gap-1 p-2 rounded-xl"
            >
              {/* Animated background for active state */}
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 bg-primary rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative z-10 flex flex-col items-center gap-1 ${
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label.split(" ")[0]}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MainLayout;
