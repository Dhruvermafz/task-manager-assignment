"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

export default function ProjectForm({
  formData,
  setFormData,
  isSubmitting = false,
}) {
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    const newTag = prompt("Enter new tag:");
    if (newTag?.trim()) {
      updateField("tags", [...(formData.tags || []), newTag.trim()]);
    }
  };

  const removeTag = (index) => {
    updateField(
      "tags",
      (formData.tags || []).filter((_, i) => i !== index),
    );
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <Label htmlFor="title">
          Project Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="My Awesome Project"
          disabled={isSubmitting}
          required
        />
      </div>

      {/* Client */}
      <div>
        <Label htmlFor="client">Client / Company</Label>
        <Input
          id="client"
          value={formData.client || ""}
          onChange={(e) => updateField("client", e.target.value)}
          placeholder="Acme Corp"
          disabled={isSubmitting}
        />
      </div>

      {/* Services */}
      <div>
        <Label htmlFor="services">Services Provided</Label>
        <Input
          id="services"
          value={formData.services || ""}
          onChange={(e) => updateField("services", e.target.value)}
          placeholder="UI/UX Design, Web Development"
          disabled={isSubmitting}
        />
      </div>

      {/* Overview / Description */}
      <div>
        <Label htmlFor="overview">Overview / Description</Label>
        <Textarea
          id="overview"
          value={formData.overview || ""}
          onChange={(e) => updateField("overview", e.target.value)}
          placeholder="Brief description of the project..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      {/* Results */}
      <div>
        <Label htmlFor="results">Results / Impact</Label>
        <Textarea
          id="results"
          value={formData.results || ""}
          onChange={(e) => updateField("results", e.target.value)}
          placeholder="Increased conversions by 45%..."
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ghLink">GitHub URL</Label>
          <Input
            id="ghLink"
            type="url"
            value={formData.ghLink || ""}
            onChange={(e) => updateField("ghLink", e.target.value)}
            placeholder="https://github.com/username/repo"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="website">Live Website URL</Label>
          <Input
            id="website"
            type="url"
            value={formData.website || ""}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://myproject.com"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Main Image / Thumbnail */}
      <div>
        <Label htmlFor="mainImage">Main Image / Thumbnail</Label>
        <Input
          id="mainImage"
          value={formData.mainImage || ""}
          onChange={(e) => updateField("mainImage", e.target.value)}
          placeholder="image-filename.jpg or full URL"
          disabled={isSubmitting}
          helperText="You can paste a filename (will be uploaded) or a direct image URL"
        />
      </div>

      {/* Multiple Images */}
      {/* Multiple Images */}
      <div className="space-y-4">
        <Label>Additional Project Images</Label>

        {/* Image Preview Grid */}
        <div className="flex flex-wrap gap-3">
          {(formData.images || []).map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt=""
                className="w-24 h-24 object-cover rounded-md border"
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Image Input */}
        <Input
          placeholder="Paste image URL and press Enter"
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              e.preventDefault();

              updateField("images", [
                ...(formData.images || []),
                e.target.value.trim(),
              ]);

              e.target.value = "";
            }
          }}
        />

        {(formData.images || []).length === 0 && (
          <p className="text-sm text-muted-foreground italic">
            No images added yet.
          </p>
        )}
      </div>

      {/* Tags */}
      {/* Tags */}
      <div className="space-y-3">
        <Label>Tags</Label>

        {/* Tags Display */}
        <div className="flex flex-wrap gap-2">
          {(formData.tags || []).map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-secondary-foreground/70 hover:text-destructive"
                disabled={isSubmitting}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Tag Input */}
        <Input
          placeholder="Type tag and press Enter"
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              e.preventDefault();

              updateField("tags", [
                ...(formData.tags || []),
                e.target.value.trim(),
              ]);

              e.target.value = "";
            }
          }}
        />
      </div>
      {/* Priority */}
      <div>
        <Label htmlFor="priority">Priority (for pinning)</Label>
        <Input
          id="priority"
          type="number"
          min="0"
          value={formData.priority || 0}
          onChange={(e) =>
            updateField("priority", parseInt(e.target.value) || 0)
          }
          disabled={isSubmitting}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Higher number = shown first (pinned)
        </p>
      </div>
    </div>
  );
}
