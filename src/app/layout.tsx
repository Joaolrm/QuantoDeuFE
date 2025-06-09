// src/app/layout.tsx
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-[#4B0000] via-[#660000] to-black text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
