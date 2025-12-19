import { motion } from "framer-motion";
import { CalendarDays, Sparkles, Wallet, Lightbulb, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";
import FloatingFoodDecorations from "@/components/FloatingFoodDecorations";

const Dashboard = () => {
  const location = useLocation();
  const budgetUsed = 180;
  const budgetTotal = 250;
  const budgetProgress = (budgetUsed / budgetTotal) * 100;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[hsl(68,60%,95%)] to-[hsl(68,50%,88%)] overflow-hidden">
      {/* Floating Decorative SVG Images - Transparent */}
      <FloatingFoodDecorations />

      {/* Main Glass Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-[98%] max-w-[1600px] h-[90vh] bg-background/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-border/50 flex overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content Area - Bento Grid */}
          <main className="flex-1 flex flex-col p-6 md:p-8 overflow-auto">
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-gradient-to-r from-[hsl(68,80%,75%)] to-[hsl(68,70%,85%)] rounded-3xl p-6 md:p-8 mb-6 flex items-center justify-between overflow-hidden relative"
            >
              <div className="z-10">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Good Morning, User! 👋
                </h1>
                <p className="text-muted-foreground mt-2 text-base md:text-lg">
                  Ready to fuel your body today?
                </p>
              </div>
              {/* Streak Counter */}
              <div className="hidden md:flex items-center gap-2 bg-background/60 backdrop-blur-md px-4 py-2 rounded-full border border-border/30">
                <Flame className="text-orange-500" size={20} />
                <span className="font-bold text-foreground">5 Day Streak</span>
              </div>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Action Cards - Span 2 columns */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Generate Meal Plan Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-background/90 backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 shadow-xl cursor-pointer flex flex-col"
                >
                  {/* Image area - Healthy Rice Bowl */}
                  <div className="h-40 md:h-48 bg-gradient-to-br from-[hsl(68,60%,90%)] to-[hsl(68,50%,80%)] flex items-center justify-center overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80"
                      alt="Healthy Rice Bowl"
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tag */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary w-fit mb-3">
                      Recommended for you
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                      <CalendarDays className="text-primary" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Generate Meal Plan
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      Get a weekly plan tailored to your budget & health goals.
                    </p>
                    <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                      Create Plan
                    </Button>
                  </div>
                </motion.div>

                {/* Nutrition Chatbot Card */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-background/90 backdrop-blur-md rounded-3xl overflow-hidden border border-border/40 shadow-xl cursor-pointer flex flex-col"
                >
                  {/* Image area - AI Brain/Sparkles */}
                  <div className="h-40 md:h-48 bg-gradient-to-br from-[hsl(270,60%,92%)] to-[hsl(280,50%,85%)] flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="relative"
                    >
                      <div className="w-24 h-24 rounded-full bg-background/50 flex items-center justify-center">
                        <Sparkles className="text-purple-500" size={48} />
                      </div>
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-purple-400/50"
                      />
                      <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                        className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-purple-300/50"
                      />
                    </motion.div>
                  </div>
                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tag */}
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 w-fit mb-3">
                      24/7 Support
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                      <Sparkles className="text-primary" size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Ask NutriMind AI
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      Instant answers about calories, substitutions & nutrition.
                    </p>
                    <Link to="/chat" className="w-full">
                      <Button className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
                        Start Chat
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Widgets */}
              <div className="flex flex-col gap-6">
                {/* Daily Budget Tracker Widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-background/90 backdrop-blur-md rounded-3xl p-6 border border-border/40 shadow-lg flex-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Wallet className="text-primary" size={20} />
                    </div>
                    <h3 className="font-semibold text-foreground">Today's Budget</h3>
                  </div>
                  
                  {/* Circular Progress */}
                  <div className="flex items-center justify-center py-4">
                    <div className="relative w-28 h-28">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-muted/30"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="8"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="42"
                          cx="50"
                          cy="50"
                          strokeDasharray={`${budgetProgress * 2.64} 264`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-foreground">৳{budgetUsed}</span>
                        <span className="text-xs text-muted-foreground">of ৳{budgetTotal}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-sm text-muted-foreground">
                    ৳{budgetTotal - budgetUsed} remaining today
                  </p>
                </motion.div>

                {/* Daily Tip Widget */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-[hsl(38,90%,95%)] to-[hsl(38,80%,88%)] backdrop-blur-md rounded-3xl p-6 border border-border/40 shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Lightbulb className="text-amber-500" size={20} />
                    </div>
                    <h3 className="font-semibold text-foreground">Daily Tip</h3>
                  </div>
                  
                  <p className="text-foreground/80 text-sm leading-relaxed">
                    💡 <strong>Did you know?</strong> Masoor dal provides 9g protein per 100g — perfect for affordable, nutritious meals!
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border/30 py-4 px-6 flex justify-around z-50">
              {mobileNavItems.slice(0, 4).map((item) => (
                <Link key={item.label} to={item.path}>
                  <button
                    className={`p-2 rounded-xl ${
                      location.pathname === item.path
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon size={24} />
                  </button>
                </Link>
              ))}
            </nav>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
