// src/components/auth/RegisterForm.tsx
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { CreatePeopleRequest } from "@/types/api";
import {
  formatPhone,
  cleanPhone,
  savePhoneToStorage,
  getPhoneFromStorage,
  clearPhoneFromStorage,
} from "@/utils/phoneUtils";
import Swal from "sweetalert2";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [formData, setFormData] = useState<CreatePeopleRequest>({
    name: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "Unspecified",
  });

  // Carrega o telefone do localStorage na inicialização
  useEffect(() => {
    const savedPhone = getPhoneFromStorage();
    if (savedPhone) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: savedPhone,
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData((prev) => ({
      ...prev,
      phoneNumber: formatted,
    }));
    // Salva o telefone no localStorage sempre que for alterado
    savePhoneToStorage(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove formatação antes de enviar
      const dataToSend = {
        ...formData,
        phoneNumber: cleanPhone(formData.phoneNumber),
      };

      await apiService.createPeople(dataToSend);

      await Swal.fire({
        icon: "success",
        title: "Cadastro realizado com sucesso!",
        confirmButtonText: "OK",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redireciona para a página específica se houver, senão vai para login
      if (redirectTo) {
        router.push(`/login?redirect=${encodeURIComponent(redirectTo)}`);
      } else {
        router.push("/login");
      }
    } catch (error: any) {
      // Tenta extrair a mensagem do corpo da resposta
      const errorMessage =
        error?.response?.data?.message || // Caso comum em APIs bem estruturadas
        error?.response?.data || // Fallback se for só uma string
        "Erro ao cadastrar. Por favor, tente novamente.";

      console.error("Registration error:", error);

      await Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar",
        text: errorMessage,
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#4B0000] via-[#660000] to-black p-4 sm:p-8">
      <div className="w-full max-w-md bg-[#330000]/90 rounded-xl shadow-lg p-6 sm:p-8 backdrop-blur-sm text-white">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Quanto Deu?
        </h1>
        <p className="text-center mb-4 sm:mb-6 text-sm tracking-wide">
          Cadastro
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-1"
            >
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-2 sm:p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-white mb-1"
            >
              Telefone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
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

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-white mb-1"
            >
              Data de Nascimento
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-2 sm:p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              required
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-white mb-1"
            >
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-2 sm:p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              required
            >
              <option value="Unspecified">Não especificado</option>
              <option value="Male">Masculino</option>
              <option value="Female">Feminino</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 text-black font-bold py-2 sm:py-3 rounded-md hover:opacity-90 transition duration-200 text-sm sm:text-base"
          >
            Cadastrar
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-orange-400 hover:text-orange-300 underline"
            >
              Já tem conta? Faça login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
