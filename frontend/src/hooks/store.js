// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/userApi";
import { roleApi } from "@/api/roleApi";
import { taskApi } from "@/api/taskApi";
export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [roleApi.reducerPath]: roleApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApi.middleware,
      taskApi.middleware,
      roleApi.middleware,
    ),
});
