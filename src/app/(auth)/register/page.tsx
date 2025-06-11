// src/app/(auth)/register/page.tsx
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuantoDeu - Cadastro",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
