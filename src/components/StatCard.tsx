import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconColor: string;
  label: string;
  value: string;
  delay?: number;
  className?: string;
}

const StatCard = ({ icon: Icon, iconColor, label, value, delay = 0, className = "" }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className={`bg-card rounded-2xl shadow-card p-4 flex items-center gap-3 backdrop-blur-sm border border-border/50 ${className}`}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Icon size={22} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-base font-bold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;
