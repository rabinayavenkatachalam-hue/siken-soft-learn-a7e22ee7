import { motion } from "framer-motion";
import { Users, FileText, BookOpen } from "lucide-react";

const tutorCourses = [
  { title: "Java 101", students: 42, submissions: 5 },
  { title: "Python Basics", students: 38, submissions: 3 },
  { title: "AI & ML Fundamentals", students: 55, submissions: 8 },
  { title: "Data Structures in C++", students: 30, submissions: 2 },
  { title: "Web Development", students: 47, submissions: 6 },
];

const TutorCourses = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-xl font-bold text-foreground mb-6">My Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorCourses.map((course) => (
          <div key={course.title} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-3">{course.title}</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{course.students} Students Enrolled</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{course.submissions} New Submissions</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TutorCourses;
