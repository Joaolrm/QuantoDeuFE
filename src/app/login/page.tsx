import { LoginForm } from "@/components/LoginForm";
import ".///style.css";

export default function LoginPage() {
  return (
    <div className=" bg-gray-50 text-gray-50 flex flex-col  py-12 sm:px-6 lg:px-8 container-login">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-xl font-medium text-gray-100">
          Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="pt4 py-2 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
