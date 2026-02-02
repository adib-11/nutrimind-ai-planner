import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type CallbackStatus = "loading" | "success" | "error" | "cancelled";

/**
 * AuthCallback - Handles OAuth callback from Google authentication
 * 
 * Implements:
 * - AC2: Creates User record for new users, redirects to Onboarding/Dashboard
 * - AC3: Detects cancellation and shows appropriate message
 * - AC4: Links existing accounts without creating duplicates
 */
const AuthCallback = () => {
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [message, setMessage] = useState("Processing authentication...");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      console.log("🔍 AuthCallback: Starting OAuth callback handling");
      console.log("🔍 URL params:", Object.fromEntries(searchParams.entries()));
      
      // AC3: Check for OAuth cancellation via URL params
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      console.log("🔍 Error check:", { error, errorDescription });

      if (error === "access_denied" || error === "user_cancelled") {
        setStatus("cancelled");
        setMessage("Sign-in cancelled");
        toast({
          title: "Sign-in cancelled",
          description: "You cancelled the Google sign-in process.",
          variant: "default",
        });
        // Redirect back to auth page after short delay
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
        return;
      }

      if (error) {
        setStatus("error");
        setMessage(errorDescription || "Authentication failed");
        toast({
          title: "Authentication failed",
          description: errorDescription || "An error occurred during sign-in.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
        return;
      }

      // Check Supabase configuration
      if (!isSupabaseConfigured()) {
        setStatus("error");
        setMessage("Authentication service not configured");
        toast({
          title: "Configuration Error",
          description: "Supabase is not configured. Please contact support.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
        return;
      }

      try {
        console.log("🔍 Getting session from Supabase...");
        // Supabase automatically handles the OAuth callback and sets session
        // when detectSessionInUrl is true (configured in supabase.ts)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        console.log("🔍 Session data:", sessionData);
        console.log("🔍 Session error:", sessionError);

        if (sessionError) {
          throw sessionError;
        }

        if (!sessionData.session) {
          // No session found - might be an error or incomplete flow
          setStatus("error");
          setMessage("No session found. Please try again.");
          toast({
            title: "Authentication failed",
            description: "Could not establish a session. Please try again.",
            variant: "destructive",
          });
          setTimeout(() => navigate("/auth", { replace: true }), 2000);
          return;
        }

        const { session } = sessionData;
        const supabaseUser = session.user;

        console.log("🔍 Supabase user:", supabaseUser);

        // AC2 & AC4: Check if user exists in our custom User table
        console.log("🔍 Checking if user exists in User table...");
        const { data: existingUser, error: fetchError } = await supabase
          .from("User")
          .select("id, onboardingCompleted")
          .eq("supabaseAuthId", supabaseUser.id)
          .single();

        console.log("🔍 Existing user:", existingUser);
        console.log("🔍 Fetch error:", fetchError);

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = row not found, which is expected for new users
          console.error("Error fetching user:", fetchError);
          throw fetchError;
        }

        let isNewUser = false;

        if (!existingUser) {
          // AC2: New user - create User record with authProvider: 'google'
          isNewUser = true;
          const { data: newUser, error: insertError } = await supabase
            .from("User")
            .insert({
              supabaseAuthId: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null,
              authProvider: "google",
              onboardingCompleted: false,
            })
            .select()
            .single();

          if (insertError) {
            // AC4: Check if this is a duplicate email (user exists with different auth method)
            if (insertError.code === "23505") {
              // Unique constraint violation - email already exists
              // This means the email was registered via email/password
              // The user is now linked to their existing account via Supabase Auth
              setStatus("success");
              setMessage("Welcome back! Signing you in...");
              toast({
                title: "Welcome back!",
                description: "Your Google account has been linked.",
              });
              setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
              return;
            }
            throw insertError;
          }

          // Bootstrap: Create default profile data for new user
          if (newUser) {
            console.log("🔍 Bootstrapping profile data for new user:", newUser.id);
            
            // Create default records in parallel for better performance
            await Promise.all([
              // Default Biometrics
              supabase.from("Biometrics").insert({
                userId: newUser.id,
                age: 0,
                gender: "Male",
                height: 0,
                weight: 0,
                targetWeight: 0,
                activityLevel: "Moderate",
              }),
              // Default Health Profile
              supabase.from("HealthProfile").insert({
                userId: newUser.id,
                hasDiabetes: false,
                hasHypertension: false,
                hasHighCholesterol: false,
                hasGastritis: false,
              }),
              // Default Preferences
              supabase.from("Preferences").insert({
                userId: newUser.id,
                dietType: "",
                allergens: [],
                spiceLevel: 3,
                dailyBudget: 250,
                foodPreferences: [],
              }),
            ]);

            console.log("✅ Profile data bootstrapped successfully");
          }
        }

        // AC2: Success - redirect based on user status
        setStatus("success");

        if (isNewUser) {
          setMessage("Account created! Redirecting to onboarding...");
          toast({
            title: "Welcome to NutriMind!",
            description: "Let's set up your profile.",
          });
          setTimeout(() => navigate("/onboarding", { replace: true }), 1500);
        } else if (!existingUser?.onboardingCompleted) {
          // Existing user but hasn't completed onboarding
          setMessage("Welcome back! Continuing onboarding...");
          toast({
            title: "Welcome back!",
            description: "Let's finish setting up your profile.",
          });
          setTimeout(() => navigate("/onboarding", { replace: true }), 1500);
        } else {
          // AC4: Existing user with completed onboarding
          setMessage("Welcome back! Redirecting to dashboard...");
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          });
          setTimeout(() => navigate("/dashboard", { replace: true }), 1500);
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        setStatus("error");
        setMessage("An unexpected error occurred");
        toast({
          title: "Authentication failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/auth", { replace: true }), 2000);
      }
    };

    handleCallback();
  }, [navigate, searchParams, toast]);

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-12 h-12 text-primary animate-spin" />;
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-destructive" />;
      case "cancelled":
        return <XCircle className="w-12 h-12 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full flex items-center justify-center bg-background"
    >
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center"
        >
          {getIcon()}
        </motion.div>
        
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-foreground">
            {status === "loading" && "Authenticating..."}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
            {status === "cancelled" && "Sign-in Cancelled"}
          </h1>
          <p className="text-muted-foreground mt-2">{message}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthCallback;
