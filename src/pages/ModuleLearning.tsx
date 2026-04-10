import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, XCircle } from "lucide-react";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

const sampleQuizzes: QuizQuestion[] = [
  { question: "What does OOP stand for?", options: ["Object-Oriented Programming", "Open Operating Platform", "Output Optimization Process", "Ordered Object Protocol"], correct: 0 },
  { question: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correct: 1 },
  { question: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: 2 },
  { question: "Which keyword is used for inheritance in Java?", options: ["implements", "inherits", "extends", "super"], correct: 2 },
  { question: "What is a variable that holds a memory address called?", options: ["Reference", "Pointer", "Handler", "Allocator"], correct: 1 },
];

const ModuleLearning = () => {
  const { id, moduleIndex } = useParams();
  const navigate = useNavigate();
  const course = courses.find((c) => c.id === id);
  const modIdx = Number(moduleIndex);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!course || isNaN(modIdx) || modIdx < 0 || modIdx >= course.modules.length) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-muted-foreground">Module not found.</p>
      </div>
    );
  }

  const moduleName = course.modules[modIdx];
  const quiz = sampleQuizzes.slice(0, 3 + (modIdx % 3)); // 3-5 questions

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
  };

  const score = submitted ? quiz.filter((q, i) => answers[i] === q.correct).length : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-cream">
      <header className="bg-card shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={() => navigate(`/course/${id}/roadmap`)} className="text-foreground hover:text-primary">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <Link to="/" className="text-2xl font-bold text-primary">SIKER</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-1">Module {modIdx + 1}: {moduleName}</h1>
        <p className="text-muted-foreground mb-8">{course.title}</p>

        {/* Tutor Notes Placeholder */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Tutor Notes</h2>
          </div>
          <div className="bg-muted rounded-xl p-6 text-center text-muted-foreground">
            <p>Notes for this module will appear here once uploaded by your tutor.</p>
          </div>
        </div>

        {/* Quiz */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Module Quiz</h2>
          <div className="space-y-6">
            {quiz.map((q, qIdx) => (
              <div key={qIdx}>
                <p className="font-medium text-foreground mb-2">{qIdx + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const selected = answers[qIdx] === oIdx;
                    const isCorrect = q.correct === oIdx;
                    let borderClass = "border-border";
                    if (submitted && selected && isCorrect) borderClass = "border-green-500 bg-green-50";
                    else if (submitted && selected && !isCorrect) borderClass = "border-red-400 bg-red-50";
                    else if (submitted && isCorrect) borderClass = "border-green-400 bg-green-50/50";

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelect(qIdx, oIdx)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl border ${borderClass} ${selected && !submitted ? "border-primary bg-primary/5" : ""} transition-colors text-sm`}
                      >
                        <span className="flex items-center justify-between">
                          {opt}
                          {submitted && selected && isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {submitted && selected && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!submitted ? (
            <Button
              className="mt-6 w-full rounded-xl bg-primary text-primary-foreground"
              disabled={Object.keys(answers).length < quiz.length}
              onClick={() => setSubmitted(true)}
            >
              Submit Quiz
            </Button>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-foreground font-semibold mb-4">
                You scored {score}/{quiz.length}
              </p>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate(`/course/${id}/roadmap`)}
              >
                Back to Modules
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleLearning;
