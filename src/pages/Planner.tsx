import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  RefreshCw,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowLeftRight,
  BookOpen,
  LayoutGrid,
  Utensils,
  MessageSquare,
  ShoppingBasket,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";
import FloatingFoodDecorations from "@/components/FloatingFoodDecorations";

const Planner = () => {
  const location = useLocation();
  const [activeDay, setActiveDay] = useState(1);

  const days = [
    { day: "Sun", date: 22 },
    { day: "Mon", date: 23 },
    { day: "Tue", date: 24 },
    { day: "Wed", date: 25 },
    { day: "Thu", date: 26 },
    { day: "Fri", date: 27 },
    { day: "Sat", date: 28 },
  ];

  const meals = [
    {
      type: "Breakfast",
      time: "8:00 AM",
      title: "2x Whole Wheat Roti + Masoor Dal",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop",
      tags: [
        { label: "Vegetarian", color: "bg-green-100 text-green-700" },
        { label: "Low Cost", color: "bg-blue-100 text-blue-700" }
      ],
      calories: 350,
      cost: 35
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      title: "Chicken Curry + Steamed Rice",
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop",
      tags: [
        { label: "High Protein", color: "bg-orange-100 text-orange-700" },
        { label: "Traditional", color: "bg-purple-100 text-purple-700" }
      ],
      calories: 550,
      cost: 65
    },
    {
      type: "Snack",
      time: "5:00 PM",
      title: "Fresh Fruit Salad + Yogurt",
      image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=200&h=200&fit=crop",
      tags: [
        { label: "Healthy", color: "bg-green-100 text-green-700" },
        { label: "Quick", color: "bg-cyan-100 text-cyan-700" }
      ],
      calories: 180,
      cost: 25
    },
    {
      type: "Dinner",
      time: "8:00 PM",
      title: "Fish Bhuna + Mixed Vegetables",
      image: "https://images.unsplash.com/photo-1626777553635-be342a4515f9?w=200&h=200&fit=crop",
      tags: [
        { label: "Omega-3", color: "bg-blue-100 text-blue-700" },
        { label: "Diabetic Safe", color: "bg-emerald-100 text-emerald-700" }
      ],
      calories: 420,
      cost: 55
    }
  ];

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalCost = meals.reduce((sum, m) => sum + m.cost, 0);
  const budgetLimit = 250;
  const calorieTarget = 2000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fdec] to-[#e6f5d0] relative overflow-hidden">
      {/* Floating Background Elements - Transparent SVGs */}
      <FloatingFoodDecorations />

      <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
        {/* Main Glass Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-[98%] max-w-[1600px] h-[90vh] bg-background/60 backdrop-blur-xl rounded-[40px] shadow-2xl border border-border/50 flex overflow-hidden"
        >
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-border/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-foreground">Weekly Meal Plan</h1>
                <div className="flex gap-3">
                  <Button variant="ghost" className="text-primary hover:bg-primary/10">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Week
                  </Button>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Shopping List
                  </Button>
                </div>
              </div>

              {/* Day Selector */}
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <div className="flex-1 flex gap-2 overflow-x-auto pb-2">
                  {days.map((d, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveDay(index)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full transition-all duration-200 ${
                        activeDay === index
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "bg-background/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-xs">{d.day}</span>
                      <span className="block text-sm font-medium">{d.date}</span>
                    </button>
                  ))}
                </div>
                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
              {/* Meal Timeline */}
              <div className="flex-1 lg:w-[65%] overflow-y-auto p-6 space-y-4">
                {meals.map((meal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-background/80 rounded-2xl p-4 md:p-6 shadow-sm border border-border/30 flex flex-col md:flex-row gap-4"
                  >
                    {/* Meal Image */}
                    <div className="w-full md:w-24 h-32 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={meal.image}
                        alt={meal.title}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Meal Details */}
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">
                        {meal.type} • {meal.time}
                      </p>
                      <h3 className="font-semibold text-foreground mb-2">{meal.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {meal.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className={`text-xs px-2 py-1 rounded-full ${tag.color}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>{meal.calories} kcal</span>
                        <span>৳{meal.cost}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                        title="Find cheaper alternative"
                      >
                        <ArrowLeftRight className="w-4 h-4" />
                        <span className="md:hidden ml-2">Swap</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="md:hidden ml-2">Recipe</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Daily Snapshot */}
              <div className="lg:w-[35%] p-6 lg:border-l border-border/30">
                <div className="bg-background/90 rounded-3xl p-6 sticky top-6 space-y-6">
                  {/* Budget Tracker */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Daily Budget</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">৳{totalCost} used</span>
                        <span className="text-muted-foreground">৳{budgetLimit} limit</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(totalCost / budgetLimit) * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            totalCost > budgetLimit ? "bg-destructive" : "bg-primary"
                          }`}
                        />
                      </div>
                      <p className={`text-sm font-medium ${
                        totalCost > budgetLimit ? "text-destructive" : "text-primary"
                      }`}>
                        {totalCost <= budgetLimit 
                          ? `৳${budgetLimit - totalCost} remaining`
                          : `৳${totalCost - budgetLimit} over budget`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Nutrition Targets */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-4">Calories & Macros</h3>
                    
                    {/* Circular Progress for Calories */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            className="text-muted"
                          />
                          <motion.circle
                            cx="64"
                            cy="64"
                            r="56"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            className="text-primary"
                            initial={{ strokeDasharray: "0 352" }}
                            animate={{ 
                              strokeDasharray: `${(totalCalories / calorieTarget) * 352} 352` 
                            }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-bold text-foreground">{totalCalories}</span>
                          <span className="text-xs text-muted-foreground">/ {calorieTarget}</span>
                        </div>
                      </div>
                    </div>

                    {/* Macro Bars */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Protein</span>
                          <span className="font-medium">65g / 80g</span>
                        </div>
                        <Progress value={81} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Carbs</span>
                          <span className="font-medium">180g / 250g</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Fats</span>
                          <span className="font-medium">45g / 65g</span>
                        </div>
                        <Progress value={69} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-background/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/50 p-2 flex justify-around">
        {mobileNavItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`p-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Planner;
