// src/components/auth/LoginForm.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  formatPhone,
  cleanPhone,
  savePhoneToStorage,
  getPhoneFromStorage,
  clearPhoneFromStorage,
} from "@/utils/phoneUtils";
import Swal from "sweetalert2";

export function LoginForm() {
  const [phone, setPhone] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  // Carrega o telefone do localStorage na inicialização
  useEffect(() => {
    const savedPhone = getPhoneFromStorage();
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    // Salva o telefone no localStorage sempre que for alterado
    savePhoneToStorage(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove formatação antes de enviar
      const cleanedPhone = cleanPhone(phone);
      await login(cleanedPhone);

      // Limpa o telefone do localStorage apenas após login bem-sucedido
      clearPhoneFromStorage();

      await Swal.fire({
        icon: "success",
        title: "Logado com sucesso!",
        showConfirmButton: false,
        timer: 1000,
      });

      // Redireciona para a página específica se houver, senão vai para /main
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      await Swal.fire({
        icon: "warning",
        title: "Você ainda não possui cadastro.",
        showConfirmButton: false,
        timer: 1000,
      });

      // Mantém o redirecionamento ao ir para o registro
      const registerUrl = redirectTo
        ? `/register?redirect=${encodeURIComponent(redirectTo)}`
        : "/register";
      router.push(registerUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4B0000] via-[#660000] to-black p-4 sm:p-8">
      <div className="w-full max-w-md bg-[#330000]/90 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm text-white transform -translate-y-8">
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
              onChange={handlePhoneChange}
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-2 sm:p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              placeholder="(XX) XXXXX-XXXX"
              required
              pattern="^\(\d{2}\) \d{4,5}-\d{4}$"
              inputMode="numeric"
            />
            <p className="text-xs text-gray-300 mt-1">
              Digite seu telefone com DDD (apenas números)
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
