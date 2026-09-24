import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAS – Backoffice de afiliaciones",
  description: "Gestión de afiliaciones de Mutual Argentina Solidaria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">{children}</body>
    </html>
  );
}
