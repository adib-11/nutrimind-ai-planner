import { motion } from "framer-motion";
import { Send, Bot, User, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "react-router-dom";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";
import FloatingFoodDecorations from "@/components/FloatingFoodDecorations";

const quickPrompts = [
  { text: "Is this fruit safe?", icon: null },
  { text: "Suggest a snack under ৳20", icon: null },
  { text: "Scan Prescription", icon: Camera },
];

const Chat = () => {
  const location = useLocation();

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[hsl(68,60%,95%)] to-[hsl(68,50%,88%)] overflow-hidden">
      {/* Floating Decorative SVG Images - Transparent */}
      <FloatingFoodDecorations />

      {/* Main Glass Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 md:p-6">
        <div className="w-[98%] max-w-[1600px] h-[90vh] bg-background/70 backdrop-blur-xl rounded-[40px] shadow-2xl border border-border/50 flex overflow-hidden">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Chat Area */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Top Bar - Context Header */}
            <div className="sticky top-0 z-20 px-6 py-4 bg-background/60 backdrop-blur-md border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="text-primary" size={20} />
                </div>
                <h1 className="text-xl font-bold text-foreground">NutriMind Assistant</h1>
              </div>
              {/* Context Pill */}
              <div className="hidden sm:flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/40 text-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-muted-foreground">Personalized Mode:</span>
                <span className="font-medium text-foreground">Diabetes • ৳250 Budget</span>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* AI Welcome Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="text-primary" size={20} />
                </div>
                <div className="bg-background/70 backdrop-blur-sm rounded-2xl rounded-tl-md px-5 py-4 shadow-sm border border-border/30 max-w-[80%]">
                  <p className="text-foreground leading-relaxed">
                    Hello! I've analyzed your diabetic profile. How can I help you adjust your meal plan today?
                  </p>
                </div>
              </motion.div>

              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-start gap-4 justify-end"
              >
                <div className="bg-primary rounded-2xl rounded-tr-md px-5 py-4 shadow-sm max-w-[80%]">
                  <p className="text-primary-foreground leading-relaxed">
                    I can't find Beef in the market. What is a cheap substitute?
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="text-muted-foreground" size={20} />
                </div>
              </motion.div>

              {/* AI Response with Ingredient Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="text-primary" size={20} />
                </div>
                <div className="space-y-3 max-w-[80%]">
                  <div className="bg-background/70 backdrop-blur-sm rounded-2xl rounded-tl-md px-5 py-4 shadow-sm border border-border/30">
                    <p className="text-foreground leading-relaxed">
                      No problem! For a protein-rich, budget-friendly substitute, I recommend <strong>Lentils (Masoor Dal)</strong> or <strong>Eggs</strong>. 100g of Lentils costs approx ৳14 and is safe for your sugar levels.
                    </p>
                  </div>
                  
                  {/* Ingredient Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-background/90 backdrop-blur-md rounded-2xl p-4 border border-border/40 shadow-md flex items-center gap-4 cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-[hsl(30,70%,90%)] to-[hsl(30,60%,80%)] shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1585996746443-15106eb1c95c?w=200&q=80"
                        alt="Masoor Dal"
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">Masoor Dal (Lentils)</h4>
                      <p className="text-sm text-muted-foreground">৳14 per 100g • High Protein</p>
                    </div>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
                      Add to List
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-border/30 bg-background/40">
              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickPrompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-background/70 border border-border/40 text-sm text-foreground hover:bg-background/90 transition-colors flex items-center gap-2"
                  >
                    {prompt.icon && <prompt.icon size={14} />}
                    {prompt.text}
                  </motion.button>
                ))}
              </div>
              
              {/* Input Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ask about food, nutrition, or prices..."
                    className="w-full h-12 pl-5 pr-12 rounded-full bg-background/60 border-border/40 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Send size={20} />
                </motion.button>
              </div>
            </div>
          </main>
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
    </div>
  );
};

export default Chat;
