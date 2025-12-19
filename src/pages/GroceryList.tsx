import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Share2, 
  Trash2, 
  TrendingUp,
  ShoppingCart,
  Minus,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import AppSidebar, { mobileNavItems } from "@/components/AppSidebar";

interface GroceryItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  checked: boolean;
}

const initialItems: GroceryItem[] = [
  { id: "1", name: "500g Pui Shak (Spinach)", price: 30, quantity: 1, category: "Produce 🥬", checked: false },
  { id: "2", name: "1kg Potato (Aloo)", price: 45, quantity: 2, category: "Produce 🥬", checked: false },
  { id: "3", name: "1kg Miniket Rice", price: 70, quantity: 1, category: "Grains 🌾", checked: false },
  { id: "4", name: "500g Chicken (Broiler)", price: 180, quantity: 1, category: "Proteins 🍗", checked: false },
  { id: "5", name: "250g Small Fish (Mola)", price: 120, quantity: 1, category: "Proteins 🍗", checked: false },
  { id: "6", name: "100g Turmeric Powder", price: 40, quantity: 1, category: "Spices 🌶️", checked: false },
  { id: "7", name: "1L Mustard Oil", price: 180, quantity: 1, category: "Oils & Essentials 🫒", checked: false },
  { id: "8", name: "6 Eggs", price: 85, quantity: 1, category: "Proteins 🍗", checked: false },
];

const GroceryList = () => {
  const [items, setItems] = useState<GroceryItem[]>(initialItems);

  const categories = [...new Set(items.map(item => item.category))];

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalCost = items
    .filter(item => !item.checked)
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const weeklyBudget = 1500;
  const savings = 120;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7fdec] to-[#e6f5d0] flex">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        {/* Glass Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[98%] max-w-[1600px] mx-auto bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/50 p-6 md:p-10 min-h-[calc(100vh-4rem)]"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Grocery List</h1>
              <p className="text-muted-foreground mt-1">Based on your plan for Oct 24 - Oct 30</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Share2 className="w-4 h-4 mr-2" />
                Share/Print
              </Button>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Shopping List */}
            <div className="flex-1 lg:w-[65%] space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-sm font-bold text-foreground mb-3">{category}</h3>
                  <div className="space-y-2">
                    {items
                      .filter(item => item.category === category)
                      .map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 transition-all duration-200 ${
                            item.checked ? "opacity-50" : ""
                          }`}
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="border-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`font-semibold text-foreground ${item.checked ? "line-through" : ""}`}>
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground">Approx ৳{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <span className="w-8 text-center font-semibold text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Budget & Checkout */}
            <div className="lg:w-[35%] lg:sticky lg:top-0 lg:self-start">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-lg space-y-6">
                {/* Cost Estimation */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3">Cost Estimation</h3>
                  <p className="text-4xl font-bold text-primary">৳{totalCost}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Weekly Budget</span>
                      <span className="font-semibold text-foreground">৳{totalCost} / ৳{weeklyBudget}</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((totalCost / weeklyBudget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm text-primary">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">You are saving ৳{savings} this week!</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/30" />

                {/* Smart Order */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Too busy to shop?</h3>
                  <p className="text-xs text-muted-foreground mb-4">Order your groceries online and save time</p>
                  <Button 
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Order via Chaldal
                  </Button>
                </div>

                {/* Items Summary */}
                <div className="pt-4 border-t border-border/30">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Total Items</span>
                    <span className="font-semibold text-foreground">{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Checked Off</span>
                    <span className="font-semibold text-foreground">{items.filter(i => i.checked).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-border/30 px-4 py-2">
          <div className="flex justify-around">
            {mobileNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                    isActive 
                      ? "text-primary-foreground bg-primary" 
                      : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label.split(' ')[0]}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GroceryList;
