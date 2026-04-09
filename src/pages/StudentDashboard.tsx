import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Menu, Star, BookOpen, Clock, BarChart3, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { courses } from "@/data/courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { username, enrolledCourses, logout, isLoggedIn } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isLoggedIn) {
    navigate("/select-role");
    return null;
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const enrolledCourseData = courses.filter((c) => enrolledCourses.includes(c.id));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-card shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="text-foreground hover:text-primary">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card">
              <SheetHeader>
                <SheetTitle className="text-primary">My Learning</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                {enrolledCourseData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No courses have enrolled.</p>
                ) : (
                  <ul className="space-y-3">
                    {enrolledCourseData.map((c) => (
                      <li key={c.id} className="bg-muted rounded-xl p-3">
                        <p className="text-sm font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.provider}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {username?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <button onClick={() => { logout(); navigate("/"); }} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-foreground mb-1">Welcome, {username}!</h2>
        <p className="text-muted-foreground mb-6">Explore courses and start learning today.</p>

        {/* Search */}
        <div className="relative max-w-lg mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="pl-10 rounded-full"
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-32 flex items-center justify-center" style={{ backgroundColor: course.color + "22" }}>
                <BookOpen className="h-12 w-12" style={{ color: course.color }} />
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{course.provider}</p>
                <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{course.skills}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-500" /> {course.rating}</span>
                  <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> {course.level}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                </div>
                <Button
                  onClick={() => navigate(`/course/${course.id}`)}
                  variant="outline"
                  className="w-full rounded-xl text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Course Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No courses match your search.</p>
        )}
      </div>
    </motion.div>
  );
};

export default StudentDashboard;
