import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";

const CourseRoadmap = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted-foreground">Course not found.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream">
      <header className="bg-card shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={() => navigate(`/course/${id}`)} className="text-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
        </div>
        <p className="text-muted-foreground mb-8">Your learning roadmap — {course.modules.length} modules</p>

        <div className="space-y-4">
          {course.modules.map((mod, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-medium text-foreground">{mod}</span>
              </div>
              <Button
                size="sm"
                className="rounded-xl bg-primary text-primary-foreground gap-1"
                onClick={() => navigate(`/course/${id}/module/${i}`)}
              >
                <Play className="h-3.5 w-3.5" /> Start
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CourseRoadmap;
