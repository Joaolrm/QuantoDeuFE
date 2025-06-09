"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export function LoginForm() {
  const [phone, setPhone] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(phone);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      toast.error("Número não encontrado. Cadastre-se primeiro.");
      router.push("/register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4B0000] via-[#660000] to-black p-4 sm:p-8">
      <div className="w-full max-w-md bg-[#330000]/90 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Quanto Deu?
        </h1>
        <p className="text-center mb-4 sm:mb-6 text-sm tracking-wide">Login</p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-white mb-1"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-2 sm:p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              placeholder="Ex: 51 99856 7312"
              required
              inputMode="numeric"
            />
            <p className="text-xs text-gray-300 mt-1">
              Digite apenas números (com DDD)
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 text-black font-bold py-2 sm:py-3 rounded-md hover:opacity-90 transition duration-200 text-sm sm:text-base"
          >
            Entrar
          </button>
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-sm text-orange-400 hover:text-orange-300 underline"
            >
              Não tem conta? Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
