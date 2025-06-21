// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "QuantoDeu - Cadastro",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
