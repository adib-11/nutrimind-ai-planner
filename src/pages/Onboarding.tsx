import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  User, 
  Heart, 
  Wallet, 
  ChevronLeft, 
  ChevronRight, 
  Upload,
  Brain,
  X,
  Check
} from "lucide-react";

const MEDICAL_CONDITIONS = [
  "Diabetes (Type 2)",
  "Hypertension",
  "High Cholesterol",
  "Gastritis",
  "None"
];

const PREFERENCES = [
  "Vegetarian",
  "Halal",
  "Spicy",
  "Low Carb",
  "High Protein"
];

const LOADING_MESSAGES = [
  "Analyzing 500+ local recipes...",
  "Optimizing for your health conditions...",
  "Fitting your budget...",
  "Creating personalized meal plan..."
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  
  // Step 1 data
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  
  // Step 2 data
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");
  
  // Step 3 data
  const [budget, setBudget] = useState([250]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  useEffect(() => {
    if (isGenerating) {
      const messageInterval = setInterval(() => {
        setLoadingMessageIndex(prev => 
          prev < LOADING_MESSAGES.length - 1 ? prev + 1 : prev
        );
      }, 800);

      const redirectTimer = setTimeout(() => {
        navigate("/dashboard");
      }, 3500);

      return () => {
        clearInterval(messageInterval);
        clearTimeout(redirectTimer);
      };
    }
  }, [isGenerating, navigate]);

  const toggleCondition = (condition: string) => {
    if (condition === "None") {
      setSelectedConditions(["None"]);
    } else {
      setSelectedConditions(prev => {
        const filtered = prev.filter(c => c !== "None");
        return filtered.includes(condition)
          ? filtered.filter(c => c !== condition)
          : [...filtered, condition];
      });
    }
  };

  const togglePreference = (pref: string) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter(a => a !== allergy));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsGenerating(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepIcons = [
    <User key="user" className="h-5 w-5" />,
    <Heart key="heart" className="h-5 w-5" />,
    <Wallet key="wallet" className="h-5 w-5" />
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full bg-gradient-to-br from-[#f7fdec] to-[#e6f5d0] flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-background/60 backdrop-blur-xl border border-border/50 rounded-[40px] shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8"
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground font-medium">
                    Step {currentStep} of 3
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          step === currentStep
                            ? "bg-[#C4D600] text-white shadow-lg shadow-[#C4D600]/30"
                            : step < currentStep
                            ? "bg-[#C4D600]/20 text-[#C4D600]"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step < currentStep ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          stepIcons[step - 1]
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#C4D600] to-[#9ab000]"
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Let's get to know you
                      </h2>
                      <p className="text-muted-foreground">
                        We'll use this to personalize your meal plans
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="23"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <div className="flex gap-2">
                          {["Male", "Female", "Other"].map((g) => (
                            <button
                              key={g}
                              onClick={() => setGender(g)}
                              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                gender === g
                                  ? "bg-[#C4D600] text-white shadow-md"
                                  : "bg-background/50 text-muted-foreground hover:bg-background"
                              }`}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Height</Label>
                      <div className="flex gap-4">
                        <div className="flex-1 relative">
                          <Input
                            type="number"
                            placeholder="5"
                            value={heightFt}
                            onChange={(e) => setHeightFt(e.target.value)}
                            className="bg-background/50 pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            ft
                          </span>
                        </div>
                        <div className="flex-1 relative">
                          <Input
                            type="number"
                            placeholder="8"
                            value={heightIn}
                            onChange={(e) => setHeightIn(e.target.value)}
                            className="bg-background/50 pr-8"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            in
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentWeight">Current Weight</Label>
                        <div className="relative">
                          <Input
                            id="currentWeight"
                            type="number"
                            placeholder="75"
                            value={currentWeight}
                            onChange={(e) => setCurrentWeight(e.target.value)}
                            className="bg-background/50 pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            kg
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="targetWeight">Target Weight</Label>
                        <div className="relative">
                          <Input
                            id="targetWeight"
                            type="number"
                            placeholder="70"
                            value={targetWeight}
                            onChange={(e) => setTargetWeight(e.target.value)}
                            className="bg-background/50 pr-10"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                            kg
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Any medical conditions?
                      </h2>
                      <p className="text-muted-foreground">
                        This helps us create a safe meal plan for you
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label>Select all that apply</Label>
                      <div className="flex flex-wrap gap-2">
                        {MEDICAL_CONDITIONS.map((condition) => (
                          <button
                            key={condition}
                            onClick={() => toggleCondition(condition)}
                            className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                              selectedConditions.includes(condition)
                                ? "bg-[#C4D600] text-white shadow-md"
                                : "bg-background/50 text-muted-foreground hover:bg-background border border-border"
                            }`}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Upload Prescription (Optional)</Label>
                      <div className="border-2 border-dashed border-[#C4D600]/40 rounded-2xl p-6 text-center hover:border-[#C4D600] transition-colors cursor-pointer bg-[#C4D600]/5">
                        <Upload className="h-8 w-8 mx-auto text-[#C4D600] mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Drop your prescription here
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">
                          AI will extract diet restrictions
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Allergies</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Prawns, Peanuts"
                          value={allergyInput}
                          onChange={(e) => setAllergyInput(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addAllergy()}
                          className="bg-background/50"
                        />
                        <Button
                          onClick={addAllergy}
                          variant="outline"
                          className="border-[#C4D600] text-[#C4D600] hover:bg-[#C4D600]/10"
                        >
                          Add
                        </Button>
                      </div>
                      {allergies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {allergies.map((allergy) => (
                            <span
                              key={allergy}
                              className="inline-flex items-center gap-1 bg-red-100 text-red-700 py-1 px-3 rounded-full text-sm"
                            >
                              {allergy}
                              <button
                                onClick={() => removeAllergy(allergy)}
                                className="hover:bg-red-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Budget & Taste
                      </h2>
                      <p className="text-muted-foreground">
                        Set your daily budget and food preferences
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>Daily Budget Limit</Label>
                        <span className="text-xl font-bold text-[#C4D600]">
                          ৳{budget[0]}
                        </span>
                      </div>
                      <Slider
                        value={budget}
                        onValueChange={setBudget}
                        max={1000}
                        min={100}
                        step={50}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>৳100</span>
                        <span>৳1000</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Food Preferences</Label>
                      <div className="flex flex-wrap gap-2">
                        {PREFERENCES.map((pref) => (
                          <button
                            key={pref}
                            onClick={() => togglePreference(pref)}
                            className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                              selectedPreferences.includes(pref)
                                ? "bg-[#C4D600] text-white shadow-md"
                                : "bg-background/50 text-muted-foreground hover:bg-background border border-border"
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#C4D600]/10 rounded-2xl p-4 border border-[#C4D600]/30">
                      <h4 className="font-semibold text-foreground mb-2">
                        Your Plan Summary
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Daily budget: ৳{budget[0]}</li>
                        {selectedConditions.length > 0 && !selectedConditions.includes("None") && (
                          <li>• Optimized for: {selectedConditions.join(", ")}</li>
                        )}
                        {allergies.length > 0 && (
                          <li>• Avoiding: {allergies.join(", ")}</li>
                        )}
                        {selectedPreferences.length > 0 && (
                          <li>• Preferences: {selectedPreferences.join(", ")}</li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-[#C4D600] hover:bg-[#b3c500] text-white gap-2 px-8"
                >
                  {currentStep === 3 ? "Generate My Plan" : "Next"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-[500px]"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C4D600] to-[#9ab000] flex items-center justify-center shadow-2xl shadow-[#C4D600]/40 mb-8"
              >
                <Brain className="h-12 w-12 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Generating Your Plan...
              </h2>
              
              <div className="h-8">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMessageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-muted-foreground text-center"
                  >
                    {LOADING_MESSAGES[loadingMessageIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 mt-8">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-3 h-3 rounded-full bg-[#C4D600]"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Onboarding;
