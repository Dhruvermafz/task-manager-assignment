// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // better to include more weights
});

export const metadata = {
  title: "Dashboard App",
  description: "Your dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
