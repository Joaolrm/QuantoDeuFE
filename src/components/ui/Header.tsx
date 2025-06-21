"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showLogout?: boolean;
  children?: React.ReactNode;
}

export function Header({ title, showLogout = true, children }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-sm border-b border-white/10">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2">
          {children}
          {showLogout && (
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
              title="Sair"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 