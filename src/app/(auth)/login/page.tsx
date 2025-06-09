import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QuantoDeu - Login",
};

export default function LoginPage() {
  return <LoginForm />;
}
