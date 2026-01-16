import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Toaster } from "sonner";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Career Advisor - Your Path to Professional Success",
  description: "AI-powered career guidance platform with personalized recommendations, skill gap analysis, resume analysis, and real-time job search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
