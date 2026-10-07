import type { Metadata } from "next";

// The publications page is a client component, so its metadata lives here.
export const metadata: Metadata = { title: "Publications" };

export default function PublicationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
