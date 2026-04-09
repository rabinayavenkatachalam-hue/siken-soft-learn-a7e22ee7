import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle, ClipboardList, BarChart3, Award, Layers } from "lucide-react";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";

const sectionIcons = [CheckCircle, ClipboardList, Layers, ClipboardList, BarChart3, Award];
const sectionTitles = ["Clear Objectives", "Prerequisites", "Structured Content", "Assessments", "Progress Tracking", "Certification"];
const sectionDescriptions = [
  "What you'll learn in this course.",
  "What you need before starting.",
  "Organized lessons and modules.",
  "Quizzes, assignments, and projects to test your knowledge.",
  "Track your learning journey and stay on target.",
  "Earn a certificate of completion.",
];

const CourseDetails = () => {
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
        <button onClick={() => navigate(-1)} className="text-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Course Header */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden mb-8">
          <div className="h-48 flex items-center justify-center" style={{ backgroundColor: course.color + "22" }}>
            <BookOpen className="h-20 w-20" style={{ color: course.color }} />
          </div>
          <div className="p-6">
            <p className="text-sm text-muted-foreground mb-1">{course.provider}</p>
            <h1 className="text-2xl font-bold text-foreground mb-2">{course.title}</h1>
            <p className="text-muted-foreground text-sm">{course.skills}</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sectionTitles.map((title, i) => {
            const Icon = sectionIcons[i];
            return (
              <div key={title} className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                </div>
                <p className="text-muted-foreground text-sm mb-3">{sectionDescriptions[i]}</p>
                {i === 0 && (
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {course.objectives.map((o) => <li key={o}>{o}</li>)}
                  </ul>
                )}
                {i === 1 && (
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {course.prerequisites.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                )}
                {i === 2 && (
                  <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                    {course.modules.map((m) => <li key={m}>{m}</li>)}
                  </ol>
                )}
              </div>
            );
          })}
        </div>

        {/* Enroll Button */}
        <div className="mt-8">
          <Button
            onClick={() => navigate("/enrollment-success", { state: { courseId: course.id, courseName: course.title } })}
            className="w-full rounded-2xl py-6 text-lg bg-primary text-primary-foreground"
          >
            Enroll
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetails;
