"use client";

import { useState, useEffect } from "react";
import { getUserEvents } from "@/services/api";
import { useRouter } from "next/navigation";

export const DashboardEvents = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        const cookiePhone = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userPhone="))
          ?.split("=")[1];

        if (!cookiePhone) {
          router.push("/login"); 
          throw new Error("Usuário não autenticado.");
        }

        const userData = await getUserEvents(cookiePhone);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEvents();
  }, [router]); // Adicionado `router` como dependência

  if (isLoading) {
    return <div className="text-center text-blue-700">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center text-red-700">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-yellow-400 p-6 rounded-lg shadow-lg w-80 max-w-full">
        <h1 className="text-xl font-bold mb-4 text-center">Próximo Evento</h1>
        {user?.events?.length > 0 ? (
          user.events.map((event) => (
            <div key={event.id} className="text-black mb-4">
              <p className="font-semibold">Nome: {event.name}</p>
              <p>
                <span className="font-semibold">Data:</span>{" "}
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </p>
              <p>
                <span className="font-semibold">Endereço:</span> {event.address}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center">Nenhum evento encontrado.</p>
        )}
      </div>
    </div>
  );
};
