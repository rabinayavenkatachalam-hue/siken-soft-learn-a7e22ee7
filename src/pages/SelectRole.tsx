import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useUser, UserRole } from "@/contexts/UserContext";

const SelectRole = () => {
  const navigate = useNavigate();
  const { setSelectedRole } = useUser();
  const [role, setRole] = useState<UserRole>(null);

  const handleContinue = () => {
    if (role) {
      setSelectedRole(role);
      navigate("/sign-in");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream flex flex-col"
    >
      <header className="px-6 py-4">
        <h1 className="text-2xl font-bold text-primary">SIKER</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-12"
        >
          Who's Logging in?
        </motion.h2>

        <div className="flex gap-12 mb-12">
          {(["tutor", "student"] as const).map((r) => (
            <motion.button
              key={r}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRole(r)}
              className={`w-40 h-40 rounded-full flex items-center justify-center text-xl font-bold transition-all border-4 ${
                role === r
                  ? "border-primary bg-primary text-primary-foreground shadow-lg"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              {r === "tutor" ? "TUTOR!" : "STUDENT"}
            </motion.button>
          ))}
        </div>

        <motion.button
          whileHover={role ? { scale: 1.05 } : {}}
          whileTap={role ? { scale: 0.95 } : {}}
          onClick={handleContinue}
          disabled={!role}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl text-lg font-semibold transition-all ${
            role
              ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
          style={role ? { clipPath: "polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)", paddingRight: "3rem" } : {}}
        >
          Continue <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SelectRole;
