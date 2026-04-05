import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "@/lib/config";

export const roleApi = createApi({
  reducerPath: "roleApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api/roles`,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Role"],

  endpoints: (builder) => ({
    // ---------------- GET ALL ROLES ----------------
    getRoles: builder.query({
      query: () => "/",
      providesTags: (result) =>
        result
          ? [
              ...result.roles.map((role) => ({
                type: "Role",
                id: role._id,
              })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    // ---------------- CREATE ROLE ----------------
    createRole: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    // ---------------- UPDATE ROLE ----------------
    updateRole: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    // ---------------- DELETE ROLE ----------------
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;
