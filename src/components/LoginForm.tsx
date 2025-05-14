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
      // Validação simples do número de telefone
      if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
        throw new Error("Por favor, insira um número de telefone válido");
      }

      // Chamada à API
      const userData = await getUserEvents(phoneNumber);

      // Aqui você pode redirecionar ou armazenar os dados do usuário
      console.log("Dados do usuário:", userData);
      // Exemplo: router.push(`/dashboard?phone=${encodeURIComponent(phoneNumber)}`);

      alert(
        `Bem-vindo, ${userData.name}! Você tem ${userData.events.length} evento(s).`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocorreu um erro ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs mx-auto">
      <div className="mb-6">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Número de Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="51-991984252"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoComplete="tel"
          inputMode="numeric"
        />
        <p className="mt-1 text-xs text-gray-500">
          Formato: DD-NNNNNNNNN (ex: 51-991984252)
        </p>
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
          isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        {isLoading ? "Carregando..." : "Entrar"}
      </button>
    </form>
  );
};
