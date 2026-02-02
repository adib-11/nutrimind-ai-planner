import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { emailSchema } from "@/lib/validations/auth";

// AC2: Form validation schema
const resetPasswordSchema = z.object({
  email: emailSchema,
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  // AC2, AC6: Handle password reset request
  const handleResetRequest = async (data: ResetPasswordFormData) => {
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
      // AC2: Send password reset email via Supabase Auth
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        console.error("Reset password error:", error);
        // AC6: Don't reveal if email exists - show generic success message
        setEmailSent(true);
      } else {
        // AC2: Show success message
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      // AC6: Generic message even on error (security)
      setEmailSent(true);
    } finally {
      setIsLoading(false);
    }
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

      {/* Reset Password Card */}
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
            <h2 className="text-2xl font-semibold mt-6">Reset Password</h2>
            <p className="text-muted-foreground text-base mt-3">
              {emailSent 
                ? "Check your email for reset instructions"
                : "Enter your email to receive a password reset link"}
            </p>
          </CardHeader>

          <CardContent className="p-12 pt-6">
            {emailSent ? (
              // AC2: Success state
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="flex justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Password reset email sent!</h3>
                  <p className="text-muted-foreground">
                    If this email exists in our system, you will receive a password reset link shortly. 
                    Please check your inbox and spam folder.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    The reset link will be valid for 1 hour.
                  </p>
                </div>
                <div className="pt-4">
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
              // AC2: Reset request form
              <form onSubmit={form.handleSubmit(handleResetRequest)} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-10 h-11 ${form.formState.errors.email ? "border-destructive" : ""}`}
                      {...form.register("email")}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Sending Reset Link...
                    </>
                  ) : (
                    "Send Reset Link"
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

export default ResetPassword;
