import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Fonts
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Metadata for SEO and browser
export const metadata = {
  title: "FeedbackHub",
  description:
    "FeedbackHub is a smart suggestion system that allows students to submit ideas, feedback, and concerns anonymously. Organize, track, and analyze suggestions efficiently to improve campus life and decision-making.",
  keywords:
    "student feedback, suggestion system, anonymous suggestions, campus feedback, idea management, analytics, improve student experience",
  author: "Godwin Okon",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-gray-50 font-sans min-h-screen">
        {/* Global Toast Notifications */}
        <Toaster position="top-right" />

        {/* Main content wrapper */}
        <main className="w-full max-w-[1440px] mx-auto p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
