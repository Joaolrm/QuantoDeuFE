"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUserEvents } from "@/services/api";

export const LoginForm = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
        throw new Error("Por favor, insira um número de telefone válido");
      }

      const userData = await getUserEvents(phoneNumber);

      if (userData) {
        const cookieExpiration = new Date();
        cookieExpiration.setDate(cookieExpiration.getDate() + 61); // Expira em 61 dias
        
        const cleanedNumber = phoneNumber.replace(/\D/g, "").replace(/^55/, "");
        document.cookie = `userPhone=${cleanedNumber}; expires=${cookieExpiration.toUTCString()}; path=/`;
      }

      // alert(`Bem-vindo, ${userData.name}! Você tem ${userData.events.length} evento(s).`);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <div className="mb-6">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-50 mb-1"
        >
          Número de Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Ex: 51-991984252"
          className="w-full px-4 py-2 border border-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="tel"
          inputMode="numeric"
        />
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isLoading ? "bg-amber-400" : "bg-amber-600 hover:bg-amber-700"
        } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
      >
        {isLoading ? "Carregando..." : "Entrar"}
      </button>
    </form>
  );
};
