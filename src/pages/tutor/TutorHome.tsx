import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AlertTriangle, MessageSquare, FileText, Users, BookOpen } from "lucide-react";

const performanceData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  grades: 65 + Math.random() * 20,
  completion: 50 + Math.random() * 30,
}));

const weekSchedule = [
  { day: "Mon", items: [{ name: "Java 101", type: "lecture", time: "10:00 AM" }, { name: "Grading", type: "grading", time: "2:00 PM" }] },
  { day: "Tue", items: [{ name: "Python Basics", type: "lecture", time: "9:00 AM" }, { name: "Office Hours", type: "office", time: "3:00 PM" }] },
  { day: "Wed", items: [{ name: "AI & ML", type: "lecture", time: "11:00 AM" }] },
  { day: "Thu", items: [{ name: "Grading", type: "grading", time: "10:00 AM" }, { name: "C++ Advanced", type: "lecture", time: "2:00 PM" }] },
  { day: "Fri", items: [{ name: "Office Hours", type: "office", time: "9:00 AM" }, { name: "Data Science", type: "lecture", time: "1:00 PM" }] },
];

const typeColors: Record<string, string> = { lecture: "bg-blue-100 text-blue-700", grading: "bg-amber-100 text-amber-700", office: "bg-green-100 text-green-700" };

const alerts = [
  { student: "Arun K.", issue: "Late Submission — Assignment 3", severity: "high" },
  { student: "Priya M.", issue: "Falling below grade threshold", severity: "high" },
  { student: "Ravi S.", issue: "3 missed classes this week", severity: "medium" },
];

const activities = [
  { text: "ARUN submitted Assignment 2", time: "2 hours ago" },
  { text: "PRIYA completed Quiz 4", time: "3 hours ago" },
  { text: "RAVI asked a question in Java 101", time: "5 hours ago" },
];

const messages = [
  { from: "NILA", text: "Can you review my project?", time: "1 hour ago" },
  { from: "DEEPA", text: "Thanks for the feedback!", time: "4 hours ago" },
];

const activeCourses = [
  { title: "Java 101", students: 42, submissions: 5 },
  { title: "Python Basics", students: 38, submissions: 3 },
  { title: "AI & ML", students: 55, submissions: 8 },
];

const TutorHome = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Schedule */}
        <div className="lg:col-span-1 bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">This Week</h3>
          <div className="grid grid-cols-5 gap-2">
            {weekSchedule.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-xs font-medium text-muted-foreground mb-2">{day.day}</p>
                <div className="space-y-1">
                  {day.items.map((item, i) => (
                    <div key={i} className={`rounded-lg px-1 py-2 text-[10px] ${typeColors[item.type]}`}>
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="opacity-70">{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" /> Lectures</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Grading</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Office Hours</span>
          </div>
        </div>

        {/* Upcoming Today */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Upcoming Today</h3>
          <div className="space-y-3">
            {weekSchedule[new Date().getDay() === 0 ? 0 : Math.min(new Date().getDay() - 1, 4)].items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <span className="text-xs font-medium text-primary">{item.time}</span>
                <span className="text-sm text-foreground">{item.name}</span>
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${typeColors[item.type]}`}>{item.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Active Courses</h3>
          <div className="space-y-3">
            {activeCourses.map((c) => (
              <div key={c.title} className="bg-muted rounded-xl p-3">
                <p className="text-sm font-medium text-foreground">{c.title}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.students} students</span>
                  <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {c.submissions} new</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Performance Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="day" tick={false} />
              <YAxis domain={[40, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="grades" stroke="hsl(142, 25%, 55%)" name="Avg Grades" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="completion" stroke="hsl(230, 40%, 75%)" name="Completion Rate" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Attention Required */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Attention Required</h3>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 bg-destructive/5 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.student}</p>
                  <p className="text-xs text-muted-foreground">{a.issue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <FileText className="h-4 w-4 text-primary" />
                <p className="text-sm text-foreground flex-1">{a.text}</p>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Messages</h3>
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                <MessageSquare className="h-4 w-4 text-periwinkle" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Message from {m.from}</p>
                  <p className="text-xs text-muted-foreground">{m.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">{m.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorHome;
