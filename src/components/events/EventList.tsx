"use client";

import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { EventCutItensDTO } from "@/types/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import Swal from "sweetalert2";

export function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventCutItensDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        if (user?.phoneNumber) {
          const userData = await apiService.getPeopleEventsByPhone(
            user.phoneNumber
          );
          setEvents(userData.events || []);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Falha ao carregar eventos",
        });
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [user?.phoneNumber]);

  const handleEventDeleted = (deletedEventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== deletedEventId)
    );
    Swal.fire({
      icon: "success",
      title: "Sucesso!",
      text: "Evento excluído com sucesso!",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  if (loading) return <LoadingSpinner />;

  if (events.length === 0) {
    return (
      <div
        className="min-h-[50vh] flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('/churrasco.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg max-w-md w-full">
          <p className="text-white text-center text-lg">
            Você ainda não tem eventos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4 pb-8"
      style={{
        backgroundImage: "url('/churrasco.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "calc(100vh - 4rem)",
      }}
    >
      <div className="backdrop-blur-sm bg-black/30 p-4 rounded-lg">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onEventDeleted={handleEventDeleted}
          />
        ))}
      </div>
    </div>
  );
}
