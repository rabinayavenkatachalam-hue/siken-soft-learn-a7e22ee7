import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Calendar } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const EnrollmentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enrollCourse } = useUser();
  const { courseId, courseName } = (location.state as { courseId: string; courseName: string }) || {};

  useEffect(() => {
    if (courseId) enrollCourse(courseId);
  }, [courseId, enrollCourse]);

  if (!courseName) {
    navigate("/dashboard/student");
    return null;
  }

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 4);

  const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream flex flex-col">
      <header className="px-6 py-4">
        <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-card rounded-2xl shadow-lg p-8 w-full max-w-md border border-border text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          </motion.div>

          <h2 className="text-xl font-bold text-foreground mb-2">Enrollment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully enrolled in <span className="font-semibold text-foreground">{courseName}</span>!
          </p>

          <div className="bg-muted rounded-xl p-4 mb-6 text-left">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Schedule
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Date</span>
                <span className="text-foreground font-medium">{fmt(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date</span>
                <span className="text-foreground font-medium">{fmt(endDate)}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/dashboard/student")}
            className="w-full rounded-xl bg-primary text-primary-foreground"
          >
            Done
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnrollmentSuccess;
