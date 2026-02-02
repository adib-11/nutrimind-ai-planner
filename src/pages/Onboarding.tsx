import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
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
import { supabase } from "@/lib/supabase";
import { BiometricsStep } from "@/components/onboarding/BiometricsStep";
import type { BiometricsFormData } from "@/lib/validations/biometrics";
import type { BiometricsCalculations } from "@/types/biometrics";
import type { HealthConditions } from "@/types/health-profile";

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

const DIET_TYPES = [
  "Vegetarian",
  "Non-Vegetarian", 
  "Vegan",
  "Pescatarian"
];

const ALLERGEN_OPTIONS = [
  "Peanuts",
  "Dairy",
  "Eggs",
  "Shellfish",
  "Gluten",
  "Soy",
  "Tree Nuts"
];

const CUISINE_PREFERENCES = [
  "Bengali",
  "Western",
  "Chinese",
  "Indian",
  "Fusion"
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
  
  // Step 1 data - now managed by BiometricsStep component
  const [biometricsData, setBiometricsData] = useState<BiometricsFormData | null>(null);
  const [biometricsCalcs, setBiometricsCalcs] = useState<BiometricsCalculations | null>(null);
  
  // Step 2 data - Health Conditions (Story 1.6)
  const [healthConditions, setHealthConditions] = useState<HealthConditions>({
    hasDiabetes: false,
    hasHypertension: false,
    hasHighCholesterol: false,
    hasGastritis: false,
  });
  
  // Step 3 data
  const [dietType, setDietType] = useState("Non-Vegetarian");
  const [spiceLevel, setSpiceLevel] = useState(3);
  const [budget, setBudget] = useState([200]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Bengali"]);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState("");

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

  const toggleHealthCondition = (condition: keyof HealthConditions) => {
    setHealthConditions(prev => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  const toggleCondition = (condition: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // Deprecated - keeping for backward compatibility with other steps
    // GSAP pop animation on toggle
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
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

  const toggleAllergen = (allergen: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // GSAP pop animation on toggle
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    setSelectedAllergens(prev =>
      prev.includes(allergen)
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleCuisine = (cuisine: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // GSAP pop animation on toggle
    gsap.to(e.currentTarget, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    setSelectedCuisines(prev =>
      prev.includes(cuisine)
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
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

  // Spice level slider scale animation
  const handleSpiceLevelChange = (value: number[]) => {
    setSpiceLevel(value[0]);
    // Optional: add visual feedback similar to budget
  };

  const handleNext = async () => {
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
      // Step 3: Validate budget before proceeding
      if (budget[0] < 50) {
        // AC4: Budget validation
        alert("Minimum budget is ৳50 per day");
        return;
      }

      // Combine allergens from predefined and manual input
      const allAllergens = [...selectedAllergens, ...allergies];

      // Save preferences via Supabase
      try {
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Authentication error during onboarding save:', authError);
          throw new Error('Not authenticated');
        }

        // Get User record to get the userId
        const { data: userData, error: userError } = await supabase
          .from('User')
          .select('id')
          .eq('supabaseAuthId', user.id)
          .single();

        if (userError || !userData) {
          console.error('Failed to fetch user record:', userError);
          throw new Error('User record not found');
        }

        // Update Biometrics (from Step 1)
        if (biometricsData && biometricsCalcs) {
          await supabase
            .from('Biometrics')
            .update({
              age: biometricsData.age,
              gender: biometricsData.gender,
              height: biometricsData.height,
              weight: biometricsData.weight,
              targetWeight: biometricsData.targetWeight,
              activityLevel: biometricsData.activityLevel,
              bmi: biometricsCalcs.bmi,
              bmr: biometricsCalcs.bmr,
            })
            .eq('userId', userData.id);
        }

        // Update HealthProfile (from Step 2)
        await supabase
          .from('HealthProfile')
          .update(healthConditions)
          .eq('userId', userData.id);

        // Update Preferences (from Step 3)
        await supabase
          .from('Preferences')
          .update({
            dietType,
            allergens: allAllergens,
            spiceLevel,
            dailyBudget: budget[0],
            foodPreferences: selectedCuisines,
          })
          .eq('userId', userData.id);

        // Mark onboarding as complete
        await supabase
          .from('User')
          .update({ onboardingCompleted: true })
          .eq('id', userData.id);

      } catch (error) {
        console.error('Failed to save onboarding data:', error);
        alert('Failed to save your preferences. Please try again.');
        return; // Don't continue if save fails
      }

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

  const handleSkipHealthConditions = () => {
    // AC4: Skip sets all conditions to false and proceeds to Step 3
    setHealthConditions({
      hasDiabetes: false,
      hasHypertension: false,
      hasHighCholesterol: false,
      hasGastritis: false,
    });
    
    setIsTransitioning(true);
    gsap.to(step2Ref.current, {
      x: -50,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentStep(3);
        setIsTransitioning(false);
      },
    });
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
                <BiometricsStep
                  onNext={(data, calcs) => {
                    setBiometricsData(data);
                    setBiometricsCalcs(calcs);
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentStep(2);
                      setIsTransitioning(false);
                    }, 100);
                  }}
                />
              )}

              {currentStep === 2 && (
                <div ref={step2Ref} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Step 2 of 3: Health Conditions
                    </h2>
                    <p className="text-muted-foreground">
                      Select any health conditions to personalize your meal plan
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Diabetes Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30 hover:border-[#C4D600]/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="diabetes" className="text-base font-medium cursor-pointer">
                          Diabetes
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Type 2 diabetes management
                        </p>
                      </div>
                      <Switch
                        id="diabetes"
                        checked={healthConditions.hasDiabetes}
                        onCheckedChange={() => toggleHealthCondition('hasDiabetes')}
                        className="data-[state=checked]:bg-[#C4D600]"
                      />
                    </div>

                    {/* Hypertension Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30 hover:border-[#C4D600]/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="hypertension" className="text-base font-medium cursor-pointer">
                          Hypertension (High Blood Pressure)
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Blood pressure management
                        </p>
                      </div>
                      <Switch
                        id="hypertension"
                        checked={healthConditions.hasHypertension}
                        onCheckedChange={() => toggleHealthCondition('hasHypertension')}
                        className="data-[state=checked]:bg-[#C4D600]"
                      />
                    </div>

                    {/* High Cholesterol Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30 hover:border-[#C4D600]/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="cholesterol" className="text-base font-medium cursor-pointer">
                          High Cholesterol
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cholesterol management
                        </p>
                      </div>
                      <Switch
                        id="cholesterol"
                        checked={healthConditions.hasHighCholesterol}
                        onCheckedChange={() => toggleHealthCondition('hasHighCholesterol')}
                        className="data-[state=checked]:bg-[#C4D600]"
                      />
                    </div>

                    {/* Gastritis Toggle */}
                    <div className="flex items-center justify-between p-4 bg-background/50 rounded-xl border border-border/30 hover:border-[#C4D600]/50 transition-colors">
                      <div className="flex-1">
                        <Label htmlFor="gastritis" className="text-base font-medium cursor-pointer">
                          Gastritis
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Stomach inflammation management
                        </p>
                      </div>
                      <Switch
                        id="gastritis"
                        checked={healthConditions.hasGastritis}
                        onCheckedChange={() => toggleHealthCondition('hasGastritis')}
                        className="data-[state=checked]:bg-[#C4D600]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div ref={step3Ref} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Step 3 of 3: Dietary Preferences
                    </h2>
                    <p className="text-muted-foreground">
                      Set your dietary preferences and budget
                    </p>
                  </div>

                  {/* Diet Type Selector */}
                  <div className="space-y-3">
                    <Label>Diet Type</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {DIET_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => setDietType(type)}
                          className={`p-4 rounded-xl text-sm font-medium transition-all border ${
                            dietType === type
                              ? "bg-[#C4D600] text-white border-[#C4D600] shadow-md"
                              : "bg-background/50 text-muted-foreground hover:bg-background border-border"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Allergen Multi-Select */}
                  <div className="space-y-3">
                    <Label>Allergens (Select all that apply)</Label>
                    <div className="flex flex-wrap gap-2">
                      {ALLERGEN_OPTIONS.map((allergen) => (
                        <button
                          key={allergen}
                          onClick={(e) => toggleAllergen(allergen, e)}
                          className={`py-2 px-4 rounded-full text-sm font-medium transition-all ${
                            selectedAllergens.includes(allergen)
                              ? "bg-red-100 text-red-700 border-2 border-red-300 shadow-sm"
                              : "bg-background/50 text-muted-foreground hover:bg-background border border-border"
                          }`}
                        >
                          {allergen}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Spice Level Slider */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Spice Level</Label>
                      <span className="text-sm font-semibold text-[#C4D600]">
                        {spiceLevel === 1 && "Mild"}
                        {spiceLevel === 2 && "Slightly Spicy"}
                        {spiceLevel === 3 && "Medium"}
                        {spiceLevel === 4 && "Spicy"}
                        {spiceLevel === 5 && "Very Spicy"}
                      </span>
                    </div>
                    <Slider
                      value={[spiceLevel]}
                      onValueChange={handleSpiceLevelChange}
                      max={5}
                      min={1}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mild (1)</span>
                      <span>Very Spicy (5)</span>
                    </div>
                  </div>

                  {/* Daily Budget */}
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
                      max={500}
                      min={50}
                      step={10}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>৳50</span>
                      <span>৳500</span>
                    </div>
                  </div>

                  {/* Food Preference Tags (Cuisine) */}
                  <div className="space-y-3">
                    <Label>Cuisine Preferences</Label>
                    <div className="flex flex-wrap gap-2">
                      {CUISINE_PREFERENCES.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={(e) => toggleCuisine(cuisine, e)}
                          className={`preference-pill py-2 px-4 rounded-full text-sm font-medium transition-all ${
                            selectedCuisines.includes(cuisine)
                              ? "bg-[#C4D600] text-white shadow-md"
                              : "bg-background/50 text-muted-foreground hover:bg-background border border-border"
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#C4D600]/10 rounded-2xl p-4 border border-[#C4D600]/30">
                    <h4 className="font-semibold text-foreground mb-2">
                      Your Plan Summary
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Diet type: {dietType}</li>
                      <li>• Daily budget: ৳{budget[0]}</li>
                      <li>• Spice level: {spiceLevel}/5</li>
                      {biometricsCalcs && (
                        <>
                          <li>• BMI: {biometricsCalcs.bmi} ({biometricsCalcs.bmiCategory})</li>
                          <li>• BMR: {biometricsCalcs.bmr} calories/day</li>
                        </>
                      )}
                      {(healthConditions.hasDiabetes || healthConditions.hasHypertension || healthConditions.hasHighCholesterol || healthConditions.hasGastritis) && (
                        <li>• Optimized for: {
                          [
                            healthConditions.hasDiabetes && 'Diabetes',
                            healthConditions.hasHypertension && 'Hypertension',
                            healthConditions.hasHighCholesterol && 'High Cholesterol',
                            healthConditions.hasGastritis && 'Gastritis'
                          ].filter(Boolean).join(', ')
                        }</li>
                      )}
                      {(selectedAllergens.length > 0 || allergies.length > 0) && (
                        <li>• Avoiding: {[...selectedAllergens, ...allergies].join(", ")}</li>
                      )}
                      {selectedCuisines.length > 0 && (
                        <li>• Cuisine: {selectedCuisines.join(", ")}</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            {currentStep !== 1 && (
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
                <div className="flex gap-3">
                  {currentStep === 2 && (
                    <Button
                      variant="ghost"
                      onClick={handleSkipHealthConditions}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="bg-[#C4D600] hover:bg-[#b3c500] text-white gap-2 px-8"
                  >
                    {currentStep === 3 ? "Complete Onboarding" : "Next"}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
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
