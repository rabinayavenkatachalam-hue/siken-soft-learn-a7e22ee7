import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Link as LinkIcon, FileUp, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  type: "quiz" | "document";
  contentUrl: string;
  createdAt: string;
}

const TutorAssignments = () => {
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [assignmentType, setAssignmentType] = useState<"quiz" | "document" | null>(null);
  const [quizLink, setQuizLink] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setTitle("");
    setAssignmentType(null);
    setQuizLink("");
    setDocFile(null);
    setModalOpen(true);
  };

  const openEdit = (a: Assignment) => {
    setEditingId(a.id);
    setTitle(a.title);
    setAssignmentType(a.type);
    setQuizLink(a.type === "quiz" ? a.contentUrl : "");
    setDocFile(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    toast({ title: "Assignment deleted" });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast({ title: "Only PDF, DOCX, and images are allowed", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File must be under 10MB", variant: "destructive" });
      return;
    }
    setDocFile(file);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" });
      return;
    }
    if (!assignmentType) {
      toast({ title: "Please select an assignment type", variant: "destructive" });
      return;
    }
    if (assignmentType === "quiz" && !quizLink) {
      toast({ title: "Please enter a quiz link", variant: "destructive" });
      return;
    }
    if (assignmentType === "document" && !docFile && !editingId) {
      toast({ title: "Please select a document", variant: "destructive" });
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const contentUrl = assignmentType === "quiz" ? quizLink : docFile?.name || "document.pdf";

      if (editingId) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === editingId ? { ...a, title, type: assignmentType, contentUrl } : a))
        );
        toast({ title: "Assignment updated successfully! ✏️" });
      } else {
        setAssignments((prev) => [
          ...prev,
          { id: Date.now().toString(), title, type: assignmentType, contentUrl, createdAt: new Date().toLocaleDateString() },
        ]);
        toast({ title: "Assignment created successfully! 🎉" });
      }

      setModalOpen(false);
      setUploading(false);
    }, 1000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground">Assignments</h3>
        <Button onClick={openCreate} className="rounded-xl bg-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Create Assignment
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {assignments.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-4">No assignments have been created yet.</p>
            <Button onClick={openCreate} className="rounded-xl bg-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" /> Create Assignment
            </Button>
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {assignments.map((a) => (
              <div key={a.id} className="bg-card rounded-2xl p-4 border border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  {a.type === "quiz" ? <LinkIcon className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.type === "quiz" ? "Quiz Link" : "Document"} • {a.createdAt}</p>
                </div>
                <button onClick={() => openEdit(a)} className="text-muted-foreground hover:text-foreground p-2"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(a.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Create"} Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Assignment Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Algebra Quiz 1" className="rounded-xl" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAssignmentType("quiz")}
                className={`p-4 rounded-xl border-2 text-center transition-colors ${
                  assignmentType === "quiz" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <LinkIcon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">Upload Quiz Link</p>
              </button>
              <button
                onClick={() => setAssignmentType("document")}
                className={`p-4 rounded-xl border-2 text-center transition-colors ${
                  assignmentType === "document" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
              >
                <FileUp className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium text-foreground">Upload Document</p>
              </button>
            </div>

            {assignmentType === "quiz" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Paste your quiz link here</label>
                <Input value={quizLink} onChange={(e) => setQuizLink(e.target.value)} placeholder="https://..." className="rounded-xl" />
              </div>
            )}

            {assignmentType === "document" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Select file (PDF, DOCX, images — max 10MB)</label>
                <input type="file" accept=".pdf,.docx,image/*" onChange={handleFileChange} className="text-sm" />
                {docFile && <p className="text-xs text-muted-foreground mt-1">{docFile.name}</p>}
              </div>
            )}

            {uploading && (
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                  className="bg-primary h-2 rounded-full"
                />
              </div>
            )}

            <Button onClick={handleSubmit} disabled={uploading} className="w-full rounded-xl bg-primary text-primary-foreground">
              {uploading ? "Uploading..." : editingId ? "Update Assignment" : "Create Assignment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TutorAssignments;
