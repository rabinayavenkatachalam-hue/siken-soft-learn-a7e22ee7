import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, BookOpen, Code, Cpu, TrendingUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const coursePreviews = [
  { title: "Python", icon: Code, color: "hsl(50, 60%, 55%)" },
  { title: "Java", icon: Code, color: "hsl(15, 60%, 55%)" },
  { title: "C++", icon: Cpu, color: "hsl(340, 50%, 60%)" },
  { title: "JavaScript", icon: Code, color: "hsl(50, 80%, 50%)" },
  { title: "Data Science", icon: TrendingUp, color: "hsl(230, 40%, 75%)" },
  { title: "AI & ML", icon: Cpu, color: "hsl(142, 25%, 55%)" },
  { title: "Blockchain", icon: BookOpen, color: "hsl(270, 50%, 60%)" },
  { title: "Web Dev", icon: Code, color: "hsl(260, 40%, 65%)" },
];

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCourseClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowModal(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cream"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-card shadow-sm">
        <h1 className="text-2xl font-bold text-primary">SIKER</h1>
        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="pl-10 rounded-full border-border bg-muted"
            />
          </div>
        </form>
        <Button variant="ghost" onClick={() => navigate("/select-role")} className="text-primary font-medium">
          Sign In
        </Button>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          Welcome to <span className="text-primary">SIKER</span>
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground mb-8 max-w-lg"
        >
          A peaceful place to learn, grow, and achieve your goals.
        </motion.p>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}>
          <Button
            onClick={() => navigate("/select-role")}
            className="rounded-full px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
          >
            Sign In / Sign Up
          </Button>
        </motion.div>
      </section>

      {/* Course Slider */}
      <section className="py-12 overflow-hidden">
        <h3 className="text-2xl font-semibold text-center text-foreground mb-8">Popular Courses</h3>
        <div className="relative">
          <div className="flex animate-slide" style={{ width: "200%" }}>
            {[...coursePreviews, ...coursePreviews].map((course, i) => (
              <div
                key={i}
                onClick={handleCourseClick}
                className="flex-shrink-0 w-48 mx-3 cursor-pointer"
              >
                <div className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-center border border-border">
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: course.color + "22" }}
                  >
                    <course.icon className="h-8 w-8" style={{ color: course.color }} />
                  </div>
                  <p className="font-medium text-foreground text-sm">{course.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-in Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">Sign in to continue</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Sign in to see the full details and enroll in courses.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => { setShowModal(false); navigate("/select-role"); }} className="bg-primary text-primary-foreground rounded-xl">
            Sign In / Sign Up
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Index;
