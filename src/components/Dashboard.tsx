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
      <div className="bg-yellow-200 p-6 rounded-lg shadow-lg w-90 max-w-full">
        <h1 className="text-3xl text-red-900 font-bold mb-4 text-center">Próximo Evento</h1>
        {user?.events?.length > 0 ? (
          user.events.map((event) => (
            <div key={event.id} className="text-red-900 mb-4">
              <h2 className="text-xl font-semibold">{event.name}</h2>
              <h3 className="text-xl">
                <span className="font-semibold">Data:</span>{" "}
                {new Date(event.date).toLocaleDateString("pt-BR")}
              </h3>
                <a className="text-xl" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`} rel="noopener noreferrer">
                  <span className="font-semibold ">Loc:</span> <span className="underline">{event.address}</span>
                </a>
            </div>
          ))
        ) : (
          <p className="text-center">Nenhum evento encontrado.</p>
        )}
      </div>
    </div>
  );
};
