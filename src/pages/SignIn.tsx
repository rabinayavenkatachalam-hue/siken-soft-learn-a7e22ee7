import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const navigate = useNavigate();
  const { selectedRole, login } = useUser();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!selectedRole) navigate("/select-role");
  }, [selectedRole, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);

    try {
      // Look up the user profile by username + role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("role", selectedRole as "student" | "tutor")
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        // Check if username exists with different role
        const { data: otherProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("username", username)
          .maybeSingle() as { data: { role: string } | null };

        if (otherProfile) {
          toast({ title: "Account role mismatch", description: `Please sign in as a ${otherProfile.role}.`, variant: "destructive" });
        } else {
          toast({ title: "Invalid username or password", variant: "destructive" });
        }
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      // Sign in with email
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password,
      });

      if (authError) {
        toast({ title: "Invalid username or password", variant: "destructive" });
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setLoading(false);
        return;
      }

      login({
        username: profile.username,
        email: profile.email,
        role: selectedRole,
        userId: authData.user.id,
      });

      navigate(selectedRole === "student" ? "/dashboard/student" : "/dashboard/tutor");
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-md border border-border"
        >
          <h2 className="text-2xl font-bold text-foreground mb-1">Sign In</h2>
          <p className="text-muted-foreground mb-6">
            Signing In As <span className="font-semibold text-primary capitalize">{selectedRole}</span>
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" className="rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter password"
                  className="rounded-xl pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {capsLock && (
                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                  <AlertTriangle className="h-3 w-3" /> Caps Lock is On
                </p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground">
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="flex justify-between mt-4 text-sm">
            <Link to="/reset-password" className="text-primary hover:underline">Forgot Password?</Link>
            <Link to="/create-account" className="text-primary hover:underline">Create Account</Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignIn;
