import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutGrid, 
  Utensils, 
  MessageSquare, 
  ShoppingBasket,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const sidebarItems = [
  { icon: LayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: Utensils, label: "Meal Planner", path: "/meal-planner" },
  { icon: MessageSquare, label: "NutriChat AI", path: "/chat" },
  { icon: ShoppingBasket, label: "Grocery List", path: "/grocery-list" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface AppSidebarProps {
  className?: string;
}

const AppSidebar = ({ className = "" }: AppSidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isExpanded ? 256 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`hidden md:flex flex-col py-8 border-r border-border/30 bg-background/40 relative ${className}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full bg-background border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Logo */}
      <div className={`flex items-center mb-8 ${isExpanded ? "px-6" : "justify-center"}`}>
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
          <Utensils className="w-5 h-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-3 font-bold text-foreground whitespace-nowrap overflow-hidden"
            >
              NutriMind
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 flex flex-col gap-2 ${isExpanded ? "px-4" : "items-center px-2"}`}>
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl transition-all duration-200 ${
                isExpanded ? "px-4 py-3" : "w-12 h-12 justify-center"
              } ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className={`mt-auto ${isExpanded ? "px-4" : "flex justify-center"}`}>
        <div className={`flex items-center gap-3 ${isExpanded ? "px-4 py-3" : ""}`}>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="font-semibold text-sm text-foreground whitespace-nowrap">User</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">View Profile</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};

export const mobileNavItems = sidebarItems;

export default AppSidebar;
