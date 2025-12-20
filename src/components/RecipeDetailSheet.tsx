import { motion } from "framer-motion";
import { X, Clock, Flame, Wallet, Check, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Ingredient {
  name: string;
  checked?: boolean;
}

interface CostItem {
  item: string;
  cost: number;
}

interface RecipeData {
  type: string;
  time: string;
  title: string;
  image: string;
  tags: { label: string; color: string }[];
  calories: number;
  cost: number;
  cookTime?: string;
  costBreakdown?: CostItem[];
  ingredients?: Ingredient[];
  instructions?: string[];
}

interface RecipeDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: RecipeData | null;
  onMarkAsEaten?: () => void;
}

const DEFAULT_COST_BREAKDOWN: CostItem[] = [
  { item: "Main Protein", cost: 80 },
  { item: "Rice/Roti", cost: 20 },
  { item: "Spices & Oil", cost: 20 },
];

const DEFAULT_INGREDIENTS: Ingredient[] = [
  { name: "200g Chicken Breast", checked: false },
  { name: "1 medium Onion (chopped)", checked: false },
  { name: "2 tbsp Ginger-Garlic Paste", checked: false },
  { name: "2 medium Tomatoes (pureed)", checked: false },
  { name: "1 tsp Cumin Powder", checked: false },
  { name: "1 tsp Coriander Powder", checked: false },
  { name: "½ tsp Turmeric", checked: false },
  { name: "1 cup Steamed Rice", checked: false },
  { name: "Fresh Coriander (garnish)", checked: false },
];

const DEFAULT_INSTRUCTIONS: string[] = [
  "Marinate chicken with turmeric, salt, and half the ginger-garlic paste for 15 minutes.",
  "Heat oil in a pan, add onions and sauté until golden brown.",
  "Add remaining ginger-garlic paste and cook for 1 minute until fragrant.",
  "Add tomato puree and cook until oil separates from the masala.",
  "Add all the spice powders and mix well. Cook for 2 minutes.",
  "Add marinated chicken pieces and coat with the masala.",
  "Add ½ cup water, cover and cook on medium heat for 15-20 minutes.",
  "Once chicken is cooked through, increase heat to thicken the gravy.",
  "Garnish with fresh coriander and serve hot with steamed rice.",
];

const RecipeDetailSheet = ({
  open,
  onOpenChange,
  recipe,
  onMarkAsEaten,
}: RecipeDetailSheetProps) => {
  if (!recipe) return null;

  const costBreakdown = recipe.costBreakdown || DEFAULT_COST_BREAKDOWN;
  const ingredients = recipe.ingredients || DEFAULT_INGREDIENTS;
  const instructions = recipe.instructions || DEFAULT_INSTRUCTIONS;
  const cookTime = recipe.cookTime || "25 mins";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[480px] lg:w-[520px] p-0 bg-background/95 backdrop-blur-xl border-l border-border/50 overflow-hidden flex flex-col">
        {/* Header Image */}
        <div className="relative h-56 flex-shrink-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <SheetHeader className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`text-xs px-3 py-1 rounded-full ${tag.color}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <SheetTitle className="text-2xl font-bold text-foreground text-left">
                {recipe.title}
              </SheetTitle>
            </SheetHeader>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 px-6 py-4 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{recipe.calories} kcal</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">{cookTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">৳{recipe.cost}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Cost Breakdown */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Cost Breakdown
            </h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-2">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.item}</span>
                  <span className="font-medium">৳{item.cost}</span>
                </div>
              ))}
              <div className="border-t border-border/50 pt-2 mt-2 flex justify-between text-sm">
                <span className="font-semibold">Estimated Total</span>
                <span className="font-bold text-primary">৳{recipe.cost}</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ChefHat className="h-4 w-4 text-primary" />
              Ingredients
            </h3>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <Checkbox id={`ingredient-${index}`} />
                  <label
                    htmlFor={`ingredient-${index}`}
                    className="text-sm text-foreground cursor-pointer flex-1"
                  >
                    {ingredient.name}
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Instructions</h3>
            <div className="space-y-3">
              {instructions.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
                    {step}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/30 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <Button
            onClick={onMarkAsEaten}
            className="w-full bg-[#C4D600] hover:bg-[#b3c500] text-white h-12 text-base font-semibold rounded-xl gap-2"
          >
            <Check className="h-5 w-5" />
            Mark as Eaten
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RecipeDetailSheet;
