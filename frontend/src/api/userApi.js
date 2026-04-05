import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";
export const userApi = createApi({
  reducerPath: "userApi", // FIXED — MUST be unique
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/user`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Users"],

  endpoints: (builder) => ({
    // ------------------------------
    // REGISTER
    // ------------------------------
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    // ------------------------------
    // LOGIN
    // ------------------------------
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // ------------------------------
    // GET CURRENT USER (/me)
    // ------------------------------
    getCurrentUser: builder.query({
      query: () => "/me",
      providesTags: ["Users"],
    }),

    // ------------------------------
    // GET ALL USERS
    // ------------------------------
    getUsers: builder.query({
      query: () => "/", // ← Most backend use /api/user/all
      providesTags: ["Users"],
    }),

    // ------------------------------
    // CREATE USER
    // ------------------------------
    addUser: builder.mutation({
      query: (userData) => ({
        url: "/add",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),

    // ------------------------------
    // UPDATE USER
    // ------------------------------
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Users", id }],
    }),

    // ------------------------------
    // DELETE USER
    // ------------------------------
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useAddUserMutation,
  useGetCurrentUserQuery,
} = userApi;
