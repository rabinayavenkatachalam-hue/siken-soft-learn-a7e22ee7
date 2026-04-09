import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Mock uploaded resources
const mockResources = [
  { id: "1", name: "Chapter 1 Notes", imageUrl: "/placeholder.svg", uploadedAt: "2026-04-01" },
  { id: "2", name: "Algorithm Diagrams", imageUrl: "/placeholder.svg", uploadedAt: "2026-04-03" },
];

const TutorResources = () => {
  const navigate = useNavigate();
  const [resources] = useState(mockResources);
  const [viewImage, setViewImage] = useState<string | null>(null);

  if (resources.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20">
        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-lg text-muted-foreground mb-4">Not uploaded any notes</p>
        <Button onClick={() => navigate("/dashboard/tutor")} className="rounded-xl bg-primary text-primary-foreground">
          Okay
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-xl font-bold text-foreground mb-6">Resources</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {resources.map((r) => (
          <div
            key={r.id}
            onClick={() => setViewImage(r.imageUrl)}
            className="bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="h-32 bg-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-foreground truncate">{r.name}</p>
              <p className="text-xs text-muted-foreground">{r.uploadedAt}</p>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!viewImage} onOpenChange={() => setViewImage(null)}>
        <DialogContent className="max-w-lg rounded-2xl">
          {viewImage && <img src={viewImage} alt="Resource" className="w-full rounded-xl" />}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default TutorResources;
