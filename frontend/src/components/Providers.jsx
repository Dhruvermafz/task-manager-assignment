"use client";

import { Provider } from "react-redux";
import { store } from "@/hooks/store";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarProvider } from "@/context/SidebarContext";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
