export const mockTasks = [
  {
    id: "1",
    title: "Design new landing page",
    description:
      "Create mockups for the new marketing landing page with updated branding",
    status: "todo",
    priority: "high",
    assignee: "John Developer",
    dueDate: "2024-03-25",
    tags: ["design", "marketing"],
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "Implement authentication flow",
    description: "Add JWT-based authentication with login and registration",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Wilson",
    dueDate: "2024-03-20",
    tags: ["backend", "security"],
    createdAt: "2024-03-10",
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "in-progress",
    priority: "medium",
    assignee: "Mike Chen",
    dueDate: "2024-03-22",
    tags: ["documentation"],
    createdAt: "2024-03-12",
  },
  {
    id: "4",
    title: "Fix mobile responsiveness",
    description: "Ensure all pages work properly on mobile devices",
    status: "done",
    priority: "medium",
    assignee: "John Developer",
    dueDate: "2024-03-18",
    tags: ["frontend", "bugfix"],
    createdAt: "2024-03-08",
  },
  {
    id: "5",
    title: "Set up CI/CD pipeline",
    description:
      "Configure GitHub Actions for automated testing and deployment",
    status: "todo",
    priority: "low",
    assignee: "Sarah Wilson",
    dueDate: "2024-03-30",
    tags: ["devops"],
    createdAt: "2024-03-14",
  },
  {
    id: "6",
    title: "Database optimization",
    description: "Add indexes and optimize slow queries",
    status: "review",
    priority: "high",
    assignee: "Mike Chen",
    dueDate: "2024-03-21",
    tags: ["backend", "performance"],
    createdAt: "2024-03-13",
  },
];

export const taskStatuses = [
  {
    id: "todo",
    label: "To Do",
    color: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  },
  {
    id: "review",
    label: "Review",
    color: "bg-orange-500/15 text-orange-500 border-orange-500/20",
  },
  {
    id: "done",
    label: "Done",
    color: "bg-green-500/15 text-green-500 border-green-500/20",
  },
];

export const taskPriorities = [
  {
    id: "low",
    label: "Low",
    color: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
  },
  {
    id: "medium",
    label: "Medium",
    color: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  },
  {
    id: "high",
    label: "High",
    color: "bg-red-500/15 text-red-500 border-red-500/20",
  },
];
