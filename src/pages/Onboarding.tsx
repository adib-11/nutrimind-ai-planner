import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Check,
  Leaf
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

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
  "Analyzing your BMR...",
  "Checking 500+ Local Recipes...",
  "Optimizing for your budget...",
  "Creating personalized meal plan..."
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
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

  // GSAP Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const budgetLabelRef = useRef<HTMLSpanElement>(null);
  const progressRingRef = useRef<SVGCircleElement>(null);
  const uploadBoxRef = useRef<HTMLDivElement>(null);

  // Card entrance animation
  useGSAP(() => {
    if (!cardRef.current) return;

    gsap.from(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: "elastic.out(1, 0.75)",
    });
  }, []);

  // Step 1 entrance stagger
  useGSAP(() => {
    if (currentStep !== 1 || !step1Ref.current || isTransitioning) return;

    const inputs = step1Ref.current.querySelectorAll(".step1-input");
    gsap.fromTo(
      inputs,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.2, ease: "power2.out" }
    );
  }, [currentStep, isTransitioning]);

  // Step 2 entrance
  useGSAP(() => {
    if (currentStep !== 2 || !step2Ref.current || isTransitioning) return;

    gsap.fromTo(
      step2Ref.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );

    // Pulse the upload box border
    if (uploadBoxRef.current) {
      gsap.to(uploadBoxRef.current, {
        borderColor: "rgba(196, 214, 0, 0.8)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, [currentStep, isTransitioning]);

  // Step 3 entrance
  useGSAP(() => {
    if (currentStep !== 3 || !step3Ref.current || isTransitioning) return;

    gsap.fromTo(
      step3Ref.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [currentStep, isTransitioning]);

  // Loading screen animations
  useGSAP(() => {
    if (!isGenerating || !loadingRef.current) return;

    const ctx = gsap.context(() => {
      // Brain icon pulsing
      const brainIcon = loadingRef.current?.querySelector(".loading-brain");
      if (brainIcon) {
        gsap.to(brainIcon, {
          scale: 1.1,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // Progress ring animation
      if (progressRingRef.current) {
        const circumference = 2 * Math.PI * 45;
        gsap.fromTo(
          progressRingRef.current,
          { strokeDasharray: `0 ${circumference}` },
          {
            strokeDasharray: `${circumference} ${circumference}`,
            duration: 3.5,
            ease: "power1.inOut",
          }
        );
      }

      // Message carousel
      const messages = loadingRef.current?.querySelectorAll(".loading-message");
      if (messages) {
        messages.forEach((msg, i) => {
          gsap.fromTo(
            msg,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: i * 0.8,
              ease: "power2.out",
            }
          );
          if (i < messages.length - 1) {
            gsap.to(msg, {
              opacity: 0,
              y: -10,
              duration: 0.3,
              delay: (i + 1) * 0.8 - 0.1,
            });
          }
        });
      }
    }, loadingRef);

    return () => ctx.revert();
  }, [isGenerating]);

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

  const toggleCondition = (condition: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // GSAP pop animation on toggle
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

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

  const togglePreference = (pref: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // GSAP pop animation on toggle
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

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

  // Budget slider scale animation
  const handleBudgetChange = (value: number[]) => {
    setBudget(value);
    if (budgetLabelRef.current) {
      gsap.to(budgetLabelRef.current, {
        scale: 1.3,
        color: "#C4D600",
        duration: 0.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(budgetLabelRef.current, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        },
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setIsTransitioning(true);
      const currentStepRef = currentStep === 1 ? step1Ref : step2Ref;
      
      // Exit animation
      gsap.to(currentStepRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentStep(currentStep + 1);
          setIsTransitioning(false);
        },
      });
    } else {
      // Fade out form, show loading
      gsap.to(formRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setIsGenerating(true);
        },
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      const currentStepRef = currentStep === 2 ? step2Ref : step3Ref;
      
      // Exit animation (slide right)
      gsap.to(currentStepRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentStep(currentStep - 1);
          setIsTransitioning(false);
        },
      });
    }
  };

  const stepIcons = [
    <User key="user" className="h-5 w-5" />,
    <Heart key="heart" className="h-5 w-5" />,
    <Wallet key="wallet" className="h-5 w-5" />
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-gradient-to-br from-[#f7fdec] to-[#e6f5d0] flex items-center justify-center p-4"
    >
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-background/60 backdrop-blur-xl border border-border/50 rounded-[40px] shadow-2xl overflow-hidden"
      >
        {!isGenerating ? (
          <div ref={formRef} className="p-8">
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
                <div
                  className="h-full bg-gradient-to-r from-[#C4D600] to-[#9ab000] transition-all duration-500"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 1 && (
                <div ref={step1Ref} className="space-y-6">
                  <div className="step1-input">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Let's get to know you
                    </h2>
                    <p className="text-muted-foreground">
                      We'll use this to personalize your meal plans
                    </p>
                  </div>

                  <div className="step1-input grid grid-cols-2 gap-4">
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

                  <div className="step1-input space-y-2">
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

                  <div className="step1-input grid grid-cols-2 gap-4">
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
                </div>
              )}

              {currentStep === 2 && (
                <div ref={step2Ref} className="space-y-6">
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
                          onClick={(e) => toggleCondition(condition, e)}
                          className={`condition-pill py-2 px-4 rounded-full text-sm font-medium transition-all ${
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
                    <div
                      ref={uploadBoxRef}
                      className="border-2 border-dashed border-[#C4D600]/40 rounded-2xl p-6 text-center hover:border-[#C4D600] transition-colors cursor-pointer bg-[#C4D600]/5"
                    >
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
                </div>
              )}

              {currentStep === 3 && (
                <div ref={step3Ref} className="space-y-6">
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
                      <span
                        ref={budgetLabelRef}
                        className="text-xl font-bold text-[#C4D600]"
                      >
                        ৳{budget[0]}
                      </span>
                    </div>
                    <Slider
                      value={budget}
                      onValueChange={handleBudgetChange}
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
                          onClick={(e) => togglePreference(pref, e)}
                          className={`preference-pill py-2 px-4 rounded-full text-sm font-medium transition-all ${
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
                </div>
              )}
            </div>

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
          </div>
        ) : (
          <div
            ref={loadingRef}
            className="p-12 flex flex-col items-center justify-center min-h-[500px]"
          >
            {/* Progress Ring with Brain */}
            <div className="relative w-32 h-32 mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-muted/20"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  ref={progressRingRef}
                  className="text-[#C4D600]"
                  strokeWidth="6"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                  strokeDasharray="0 283"
                />
              </svg>
              <div className="loading-brain absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C4D600] to-[#9ab000] flex items-center justify-center shadow-xl shadow-[#C4D600]/40">
                  <Leaf className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Generating Your Plan...
            </h2>
            
            <div className="h-8 relative">
              <p className="loading-message text-muted-foreground text-center">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
            </div>

            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-[#C4D600] animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
