import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { writingGenres, writingStatuses } from "@/lib/mockWritingData";

const AddWritingProjectModal = ({
  isOpen,
  onClose,
  onSave,
  editProject = null,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "screenplay",
    status: "planning",
    description: "",
    targetWordCount: "",
    targetPages: "",
    cover: "",
  });

  useEffect(() => {
    if (editProject) {
      setFormData({
        title: editProject.title,
        genre: editProject.genre,
        status: editProject.status,
        description: editProject.description,
        targetWordCount: editProject.targetWordCount,
        targetPages: editProject.targetPages,
        cover: editProject.cover || "",
      });
    } else {
      setFormData({
        title: "",
        genre: "screenplay",
        status: "planning",
        description: "",
        targetWordCount: "",
        targetPages: "",
        cover: "",
      });
    }
  }, [editProject, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      targetWordCount: parseInt(formData.targetWordCount) || 0,
      targetPages: parseInt(formData.targetPages) || 0,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl"
        data-testid="add-writing-project-modal"
      >
        <DialogHeader>
          <DialogTitle>
            {editProject ? "Edit Writing Project" : "Start New Writing Project"}
          </DialogTitle>
          <DialogDescription>
            {editProject
              ? "Update your writing project details"
              : "Begin a new script or writing project"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-title">Project Title</Label>
              <Input
                id="project-title"
                placeholder="e.g., The Last Symphony"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                data-testid="project-title-input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project-genre">Genre/Type</Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) =>
                    setFormData({ ...formData, genre: value })
                  }
                >
                  <SelectTrigger data-testid="project-genre-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {writingGenres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.id}>
                        {genre.icon} {genre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger data-testid="project-status-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {writingStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-description">Description/Premise</Label>
              <Textarea
                id="project-description"
                placeholder="Brief description of your story/project..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                data-testid="project-description-input"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target-words">Target Word Count</Label>
                <Input
                  id="target-words"
                  type="number"
                  placeholder="e.g., 30000"
                  value={formData.targetWordCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetWordCount: e.target.value,
                    })
                  }
                  data-testid="target-words-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-pages">Target Page Count</Label>
                <Input
                  id="target-pages"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.targetPages}
                  onChange={(e) =>
                    setFormData({ ...formData, targetPages: e.target.value })
                  }
                  data-testid="target-pages-input"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover-url">Cover Image URL (optional)</Label>
              <Input
                id="cover-url"
                type="url"
                placeholder="https://example.com/cover.jpg"
                value={formData.cover}
                onChange={(e) =>
                  setFormData({ ...formData, cover: e.target.value })
                }
                data-testid="cover-url-input"
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" data-testid="save-project-button">
              {editProject ? "Update" : "Start"} Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWritingProjectModal;
