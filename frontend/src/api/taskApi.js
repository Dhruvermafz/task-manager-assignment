import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/tasks`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Tasks"],

  endpoints: (builder) => ({
    // Get all tasks (with optional filters)
    getTasks: builder.query({
      query: (params = {}) => ({
        url: "/",
        params, // supports ?status=...&priority=...&search=...
      }),
      providesTags: ["Tasks"],
    }),

    // Get single task by ID
    getTaskById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    // Create new task
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),

    // Update task
    updateTask: builder.mutation({
      query: ({ id, ...taskData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: taskData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tasks", id },
        "Tasks",
      ],
    }),

    // Delete task
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Tasks", id }, "Tasks"],
    }),

    // Optional: Update only status (for drag & drop in Kanban)
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tasks", id },
        "Tasks",
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskStatusMutation,
} = taskApi;
