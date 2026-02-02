import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  registerSchema,
  loginSchema,
  checkPasswordStrength,
  type RegisterFormData,
  type LoginFormData,
  type PasswordStrength,
} from "@/lib/validations/auth";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // AC4: Auto-redirect to Dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Watch password for strength indicator
  const watchPassword = registerForm.watch("password");

  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(checkPasswordStrength(watchPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [watchPassword]);

  // Handle registration (AC2, AC3, AC4, AC5, AC6, AC7)
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up environment variables.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        // Handle duplicate email (AC6)
        if (authError.message.toLowerCase().includes("already registered") || 
            authError.message.toLowerCase().includes("user already registered")) {
          registerForm.setError("email", {
            type: "manual",
            message: "Email already registered. Please log in.",
          });
          toast({
            title: "Email already registered",
            description: "Please log in or use a different email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Registration failed",
            description: authError.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast({
          title: "Registration failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // AC7: Show verification email message
      if (authData.user && !authData.session) {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox to verify your email address.",
        });
      }

      // AC2: Success - redirect to onboarding
      toast({
        title: "Account created!",
        description: "Let's set up your profile.",
      });

      navigate("/onboarding");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle login (AC1, AC2, AC3)
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up environment variables.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // AC1: Authenticate via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // AC2 & AC3: Generic error for invalid credentials (security)
      if (authError) {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (authData.session) {
        // AC1: JWT token is automatically stored by Supabase SDK in localStorage
        // Check onboarding status to determine redirect destination
        const { data: userProfile } = await supabase
          .from('User')
          .select('onboardingCompleted')
          .eq('supabaseAuthId', authData.user?.id)
          .single();

        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });

        // AC1: Redirect based on onboarding status
        if (userProfile?.onboardingCompleted) {
          navigate("/dashboard");
        } else {
          navigate("/onboarding");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleAuth = async () => {
    if (!isSupabaseConfigured()) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Please set up environment variables.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Google sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast({
        title: "Google sign-in failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const formVariants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    if (!passwordStrength || !watchPassword) return null;

    const requirements = [
      { key: "hasMinLength", label: "At least 8 characters", met: passwordStrength.hasMinLength },
      { key: "hasUppercase", label: "One uppercase letter", met: passwordStrength.hasUppercase },
      { key: "hasLowercase", label: "One lowercase letter", met: passwordStrength.hasLowercase },
      { key: "hasNumber", label: "One number", met: passwordStrength.hasNumber },
      { key: "hasSpecialChar", label: "One special character", met: passwordStrength.hasSpecialChar },
    ];

    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mt-2 space-y-1"
      >
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center gap-2 text-xs">
            {req.met ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-muted-foreground" />
            )}
            <span className={req.met ? "text-green-500" : "text-muted-foreground"}>
              {req.label}
            </span>
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden px-4"
    >
      {/* Animated Background Blobs - GPU Accelerated */}
      <motion.div
        initial={{ x: -100, y: -100 }}
        animate={{
          x: [-100, 50, -100],
          y: [-100, 100, -100],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-primary/40 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        initial={{ x: 100, y: 100 }}
        animate={{
          x: [100, -50, 100],
          y: [100, -50, 100],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="absolute bottom-0 right-0 w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-primary/30 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <Button variant="ghost" asChild className="gap-2">
          <Link to="/">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </Button>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-[500px] min-h-[600px] bg-background/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader className="text-center pb-6 pt-12">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-foreground">
                Nutri<span className="text-primary">Mind</span>
              </h1>
            </Link>
            <p className="text-muted-foreground text-base mt-3">
              {activeTab === "login"
                ? "Welcome back to your healthy journey."
                : "Start your personalized nutrition journey."}
            </p>
          </CardHeader>

          <CardContent className="p-12 pt-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
              </TabsList>

              {/* Form Container with overflow hidden to prevent jitter */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === "login" && (
                    <motion.div
                      key="login"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
                        <div className="space-y-2">
                          <Label htmlFor="email-login">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="email-login"
                              type="email"
                              placeholder="you@example.com"
                              className={`pl-10 h-11 ${loginForm.formState.errors.email ? "border-destructive" : ""}`}
                              {...loginForm.register("email")}
                            />
                          </div>
                          {loginForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="password-login">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="password-login"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className={`pl-10 pr-10 h-11 ${loginForm.formState.errors.password ? "border-destructive" : ""}`}
                              {...loginForm.register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                          )}
                        </div>

                        <div className="flex justify-end">
                          <Link
                            to="/auth/reset-password"
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            Forgot Password?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="animate-spin" size={18} />
                              Signing In...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "register" && (
                    <motion.div
                      key="register"
                      variants={formVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5">
                        {/* AC1: Full Name field */}
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="name"
                              type="text"
                              placeholder="John Doe"
                              className={`pl-10 h-11 ${registerForm.formState.errors.name ? "border-destructive" : ""}`}
                              {...registerForm.register("name")}
                            />
                          </div>
                          {registerForm.formState.errors.name && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                          )}
                        </div>

                        {/* AC1 & AC4: Email field with validation */}
                        <div className="space-y-2">
                          <Label htmlFor="email-register">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="email-register"
                              type="email"
                              placeholder="you@example.com"
                              className={`pl-10 h-11 ${registerForm.formState.errors.email ? "border-destructive" : ""}`}
                              {...registerForm.register("email")}
                            />
                          </div>
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                          )}
                        </div>

                        {/* AC1 & AC3: Password field with strength indicator */}
                        <div className="space-y-2">
                          <Label htmlFor="password-register">Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="password-register"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className={`pl-10 pr-10 h-11 ${registerForm.formState.errors.password ? "border-destructive" : ""}`}
                              {...registerForm.register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {registerForm.formState.errors.password && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                          )}
                          <PasswordStrengthIndicator />
                        </div>

                        {/* AC1 & AC5: Confirm Password field */}
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm Password</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className={`pl-10 pr-10 h-11 ${registerForm.formState.errors.confirmPassword ? "border-destructive" : ""}`}
                              {...registerForm.register("confirmPassword")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                          {registerForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={isLoading || !passwordStrength?.isValid}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="animate-spin mr-2" size={18} />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
                  Or continue with
                </span>
              </div>

              {/* Social Login */}
              <Button 
                variant="outline" 
                className="w-full h-11 gap-2"
                onClick={handleGoogleAuth}
                type="button"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
