"use client";

import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { EventCutItensDTO, apiService } from "@/lib/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import toast from "react-hot-toast";

export function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventCutItensDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        if (user?.phoneNumber) {
          // Busca os eventos diretamente da API usando o phoneNumber
          const peopleData = await apiService.getPeopleEventsByPhone(
            user.phoneNumber
          );
          setEvents(peopleData.events || []);
        }
      } catch (error) {
        console.error("Error loading events:", error);
        toast.error("Falha ao carregar eventos");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [user?.phoneNumber]); // Dependência apenas do phoneNumber

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
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
