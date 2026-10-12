import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AccentLabProvider } from "@/components/providers/AccentLabProvider";
import { AppNavigation } from "@/components/layout/AppNavigation";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Formant — Spoken-English Pronunciation, Prosody & Clarity Studio",
  description:
    "Assess your spoken English across 18 phonetic and prosody skills, practice guided articulatory exercises, and measure before/after improvement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("accentlab_theme");if(t==="dark"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#FBF9F5] text-[#141413] dark:bg-[#111110] dark:text-[#F3EFE6] font-sans antialiased selection:bg-[#1B4332] selection:text-[#FFFFFF] dark:selection:bg-[#265C45] dark:selection:text-[#FFFFFF]">
        <AccentLabProvider>
          <AppNavigation>{children}</AppNavigation>
        </AccentLabProvider>
      </body>
    </html>
  );
}
