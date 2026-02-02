import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Lock, Loader2, Check, X, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { passwordSchema, checkPasswordStrength, type PasswordStrength } from "@/lib/validations/auth";

// AC4: Update password form validation
const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

const UpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
  const [linkExpired, setLinkExpired] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const form = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Watch password for strength indicator
  const watchPassword = form.watch("password");

  useEffect(() => {
    if (watchPassword) {
      setPasswordStrength(checkPasswordStrength(watchPassword));
    } else {
      setPasswordStrength(null);
    }
  }, [watchPassword]);

  // AC5: Check if reset token is valid on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!isSupabaseConfigured()) {
        return;
      }

      try {
        // Check if we have an error in the URL (expired/invalid token)
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        if (error || errorDescription?.includes("expired")) {
          setLinkExpired(true);
        }

        // Also check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        // If no session and no valid recovery token, link might be expired
        if (!session && !searchParams.get("access_token")) {
          // Don't immediately mark as expired - let the user try
          // The actual error will show when they submit
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    checkTokenValidity();
  }, [searchParams]);

  // AC4: Handle password update
  const handleUpdatePassword = async (data: UpdatePasswordFormData) => {
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
      // AC4: Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        // AC5: Handle expired token
        if (error.message.includes("expired") || error.message.includes("invalid")) {
          setLinkExpired(true);
          toast({
            title: "Reset link expired",
            description: "Please request a new password reset link.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to reset password",
            description: error.message,
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // AC4: Success - show message and redirect
      toast({
        title: "Password successfully reset",
        description: "Please log in with your new password.",
      });

      // Wait a moment for user to see the success message
      setTimeout(() => {
        navigate("/auth");
      }, 1500);
    } catch (error) {
      console.error("Update password error:", error);
      toast({
        title: "Failed to reset password",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
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
      {/* Animated Background Blobs */}
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

      {/* Back to Login Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6"
      >
        <Button variant="ghost" asChild className="gap-2">
          <Link to="/auth">
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </Button>
      </motion.div>

      {/* Update Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full max-w-[500px] bg-background/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader className="text-center pb-6 pt-12">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-foreground">
                Nutri<span className="text-primary">Mind</span>
              </h1>
            </Link>
            <h2 className="text-2xl font-semibold mt-6">Set New Password</h2>
            <p className="text-muted-foreground text-base mt-3">
              {linkExpired 
                ? "Your reset link has expired"
                : "Enter your new password below"}
            </p>
          </CardHeader>

          <CardContent className="p-12 pt-6">
            {linkExpired ? (
              // AC5: Expired link state
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-destructive">Reset Link Expired</h3>
                  <p className="text-muted-foreground">
                    Your password reset link has expired or is invalid. 
                    Reset links are valid for 1 hour.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Please request a new password reset link.
                  </p>
                </div>
                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/auth/reset-password")}
                  >
                    Request New Reset Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    Return to Login
                  </Button>
                </div>
              </motion.div>
            ) : (
              // AC3, AC4: Update password form
              <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-11 ${form.formState.errors.password ? "border-destructive" : ""}`}
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                  <PasswordStrengthIndicator />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-11 ${form.formState.errors.confirmPassword ? "border-destructive" : ""}`}
                      {...form.register("confirmPassword")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
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
                      Updating Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link to="/auth" className="text-primary hover:underline">
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default UpdatePassword;
