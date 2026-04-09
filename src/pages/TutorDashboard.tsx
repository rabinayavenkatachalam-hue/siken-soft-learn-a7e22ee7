import { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, FolderOpen, Upload, LogOut, GraduationCap } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/tutor" },
  { label: "My Courses", icon: BookOpen, path: "/dashboard/tutor/courses" },
  { label: "Resources", icon: FolderOpen, path: "/dashboard/tutor/resources" },
  { label: "Assignments", icon: FileText, path: "/dashboard/tutor/assignments" },
];

const TutorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username, logout, isLoggedIn } = useUser();
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [notesName, setNotesName] = useState("");

  if (!isLoggedIn) {
    navigate("/select-role");
    return null;
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length > 5) {
      toast({ title: "Maximum 5 images allowed per upload", variant: "destructive" });
      return;
    }
    setUploadFiles(imageFiles);
  };

  const handleUpload = () => {
    if (!notesName || uploadFiles.length === 0) {
      toast({ title: "Please provide a name and select images", variant: "destructive" });
      return;
    }
    // In a real app, upload to Supabase storage
    toast({ title: "Notes uploaded successfully! 🎉" });
    setUploadOpen(false);
    setUploadFiles([]);
    setNotesName("");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">SIKER</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {username?.charAt(0)?.toUpperCase() || "T"}
            </div>
            <span className="text-sm font-medium text-foreground flex-1">{username}</span>
            <button onClick={() => { logout(); navigate("/"); }} className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-foreground">Welcome back, {username}!</h2>
          <Button onClick={() => setUploadOpen(true)} className="rounded-xl bg-primary text-primary-foreground gap-2">
            <Upload className="h-4 w-4" /> Upload Notes
          </Button>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Upload Modal */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Notes</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Notes Name</label>
              <Input value={notesName} onChange={(e) => setNotesName(e.target.value)} placeholder="e.g. Chapter 3 Notes" className="rounded-xl" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Select Images (max 5)</label>
              <input type="file" accept="image/png,image/jpg,image/jpeg" multiple onChange={handleFileSelect} className="text-sm" />
              {uploadFiles.length > 0 && <p className="text-xs text-muted-foreground mt-1">{uploadFiles.length} file(s) selected</p>}
            </div>
            <Button onClick={handleUpload} className="w-full rounded-xl bg-primary text-primary-foreground">Upload</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorDashboard;
