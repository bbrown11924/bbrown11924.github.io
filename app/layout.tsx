import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="container py-8">{children}</main>
        <footer className="container py-12 text-sm text-gray-500">
          © {new Date().getFullYear()} {site.name}
        </footer>
      </body>
    </html>
  );
}
