import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CreateAccount = () => {
  const navigate = useNavigate();
  const { selectedRole, login } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const captcha = useMemo(() => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { a, b, answer: a + b };
  }, []);
  const [captchaInput, setCaptchaInput] = useState("");

  useEffect(() => {
    if (!selectedRole) navigate("/select-role");
  }, [selectedRole, navigate]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }

    // Validate username (alphanumeric)
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      toast({ title: "Username must contain only letters and numbers", variant: "destructive" });
      return;
    }

    // Password must be exactly 6 characters
    if (password.length !== 6) {
      toast({ title: "Password must be exactly 6 characters", variant: "destructive" });
      return;
    }

    // Captcha
    if (Number(captchaInput) !== captcha.answer) {
      toast({ title: "Incorrect captcha answer", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Check if username already taken for this role
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .eq("role", selectedRole as "student" | "tutor")
        .maybeSingle();

      if (existing) {
        toast({ title: "This username is already in use. Please try another.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Check if email already exists
      const { data: emailExists } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (emailExists) {
        toast({ title: "Account already exists. Please sign in.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: authData.user.id,
          username,
          email,
          role: selectedRole,
        });

        if (profileError) throw profileError;

        // Create user_roles entry
        await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: selectedRole,
        });

        login({
          username,
          email,
          role: selectedRole,
          userId: authData.user.id,
        });

        toast({ title: "Success! Welcome aboard 🎉" });

        setTimeout(() => {
          navigate(selectedRole === "student" ? "/dashboard/student" : "/dashboard/tutor");
        }, 1500);
      }
    } catch (err: any) {
      toast({ title: err.message || "Something went wrong", variant: "destructive" });
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
        <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-md border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-1">Create Account</h2>
          <p className="text-muted-foreground mb-6">
            Joining as <span className="font-semibold text-primary capitalize">{selectedRole}</span>
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="text@email.com" className="rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" className="rounded-xl" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password (exactly 6 characters)</label>
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 characters" className="rounded-xl pr-10" maxLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">What is {captcha.a} + {captcha.b}?</label>
              <Input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Answer" className="rounded-xl" />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl bg-primary text-primary-foreground">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account? <Link to="/sign-in" className="text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateAccount;
