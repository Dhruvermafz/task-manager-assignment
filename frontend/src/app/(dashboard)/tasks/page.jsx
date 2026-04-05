"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} from "@/api/taskApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import AddTaskModal from "@/components/AddTaskModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const taskStatuses = [
  { id: "todo", label: "To Do", color: "bg-gray-500/15 text-gray-500" },
  {
    id: "in-progress",
    label: "In Progress",
    color: "bg-blue-500/15 text-blue-500",
  },
  { id: "review", label: "Review", color: "bg-yellow-500/15 text-yellow-500" },
  { id: "done", label: "Done", color: "bg-green-500/15 text-green-500" },
];

const taskPriorities = [
  { id: "low", label: "Low", color: "bg-green-500/15 text-green-500" },
  { id: "medium", label: "Medium", color: "bg-yellow-500/15 text-yellow-500" },
  { id: "high", label: "High", color: "bg-orange-500/15 text-orange-500" },
  { id: "urgent", label: "Urgent", color: "bg-red-500/15 text-red-500" },
];

export default function TasksPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("kanban");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, task: null });
  const [draggedTask, setDraggedTask] = useState(null);

  // RTK Query Hooks
  const {
    data: tasksResponse,
    isLoading,
    isError,
    refetch,
  } = useGetTasksQuery({});

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  const tasks = tasksResponse?.tasks || [];

  // Filter tasks
  const filteredTasks = tasks.filter((task) =>
    [task.title, task.description, task.assignee, ...(task.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const handleAddTask = async (formData) => {
    try {
      await createTask(formData).unwrap();
      toast.success("Task added successfully!");
      setIsAddTaskOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add task");
    }
  };

  const handleEditTask = async (formData) => {
    if (!editingTask?._id) return;
    try {
      await updateTask({ id: editingTask._id, ...formData }).unwrap();
      toast.success("Task updated successfully!");
      setEditingTask(null);
      setIsAddTaskOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteModal.task?._id) return;
    try {
      await deleteTask(deleteModal.task._id).unwrap();
      toast.success("Task deleted successfully!");
      setDeleteModal({ isOpen: false, task: null });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete task");
    }
  };

  const openEditTask = (task) => {
    setEditingTask(task);
    setIsAddTaskOpen(true);
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    if (!draggedTask || draggedTask.status === newStatus) return;

    try {
      await updateTaskStatus({
        id: draggedTask._id,
        status: newStatus,
      }).unwrap();
      toast.success(
        `Task moved to ${taskStatuses.find((s) => s.id === newStatus)?.label}`,
      );
    } catch (err) {
      toast.error("Failed to move task");
    }
    setDraggedTask(null);
  };

  const getStatusColor = (statusId) => {
    return (
      taskStatuses.find((s) => s.id === statusId)?.color ||
      "bg-gray-500/15 text-gray-500"
    );
  };

  const getPriorityColor = (priorityId) => {
    return (
      taskPriorities.find((p) => p.id === priorityId)?.color ||
      "bg-yellow-500/15 text-yellow-500"
    );
  };

  // Task Card Component
  const TaskCard = ({ task }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      className="bg-card border border-border rounded-lg p-4 mb-3 cursor-move hover:shadow-lg transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-sm flex-1 pr-2">{task.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => openEditTask(task)}
          >
            <Pencil className="w-3 h-3" strokeWidth={1.5} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive"
            onClick={() => setDeleteModal({ isOpen: true, task })}
          >
            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Badge
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </Badge>
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" strokeWidth={1.5} />
            {format(new Date(task.dueDate), "MMM dd")}
          </div>
        )}
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {task.assignee && (
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`}
            />
            <AvatarFallback className="text-xs">
              {task.assignee
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{task.assignee}</span>
        </div>
      )}
    </div>
  );

  // Kanban View
  const KanbanView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {taskStatuses.map((status) => (
        <div
          key={status.id}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status.id)}
          className="flex flex-col"
        >
          <Card className="border bg-card/50 backdrop-blur-sm flex flex-col h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${status.color.split(" ")[0]}`}
                  />
                  {status.label}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {filteredTasks.filter((t) => t.status === status.id).length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
              {filteredTasks
                .filter((task) => task.status === status.id)
                .map((task) => (
                  <TaskCard key={task._id || task.id} task={task} />
                ))}
              {filteredTasks.filter((t) => t.status === status.id).length ===
                0 && (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No tasks
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );

  // List View
  const ListView = () => (
    <Card className="border bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="border rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Task</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Priority</th>
                <th className="text-left p-4 font-medium">Assignee</th>
                <th className="text-left p-4 font-medium">Due Date</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No tasks found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id || task.id}
                    className="border-b hover:bg-muted/30"
                  >
                    <td className="p-4">
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(task.status)}>
                        {taskStatuses.find((s) => s.id === task.status)?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee}`}
                            />
                            <AvatarFallback>
                              {task.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span>{task.assignee}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {task.dueDate
                        ? format(new Date(task.dueDate), "MMM dd, yyyy")
                        : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditTask(task)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => setDeleteModal({ isOpen: true, task })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8" data-testid="tasks-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
            Tasks
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your tasks with Kanban board or list view
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null);
            setIsAddTaskOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Controls */}
      <Card className="border bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGrid className="w-4 h-4 mr-2" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4 mr-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Views */}
      {viewMode === "kanban" ? <KanbanView /> : <ListView />}

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          setEditingTask(null);
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        editTask={editingTask}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, task: null })}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteModal.task?.title}"?`}
        itemName={deleteModal.task?.title}
      />
    </div>
  );
}
