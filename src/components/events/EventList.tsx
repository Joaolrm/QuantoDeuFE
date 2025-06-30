"use client";

import { EventCard } from "@/components/events/EventCard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { EventWithAdminDTO } from "@/types/api";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import Swal from "sweetalert2";

type FilterType = "all" | "admin" | "participant";
type SortType = "date-asc" | "date-desc" | "name-asc" | "name-desc";

export function EventList() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventWithAdminDTO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventWithAdminDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("date-desc");

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

  // Filtra e ordena os eventos
  useEffect(() => {
    let filtered = [...events];

    // Aplicar filtro
    switch (filter) {
      case "admin":
        filtered = filtered.filter(event => event.isAdmin);
        break;
      case "participant":
        filtered = filtered.filter(event => !event.isAdmin);
        break;
      case "all":
      default:
        break;
    }

    // Aplicar ordenação
    switch (sortBy) {
      case "date-asc":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "date-desc":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredEvents(filtered);
  }, [events, filter, sortBy]);

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
      {/* Filtros e Ordenação */}
      <div className="backdrop-blur-sm bg-black/30 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          {/* Filtro por tipo */}
          <div className="flex-1">
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filtrar por:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="w-full p-2 rounded bg-white/90 text-gray-800 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Todos os eventos</option>
              <option value="admin">Eventos que sou admin</option>
              <option value="participant">Eventos que participo</option>
            </select>
          </div>

          {/* Ordenação */}
          <div className="flex-1">
            <label className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="w-full p-2 rounded bg-white/90 text-gray-800 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="date-desc">Data (mais recente)</option>
              <option value="date-asc">Data (mais antiga)</option>
              <option value="name-asc">Nome (A-Z)</option>
              <option value="name-desc">Nome (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Contador de eventos */}
        <div className="text-white text-sm mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {filteredEvents.length} de {events.length} eventos
          {filter !== "all" && (
            <span className="text-gray-300 ml-2">
              ({filter === "admin" ? "que você é admin" : "que você participa"})
            </span>
          )}
        </div>

        {/* Lista de eventos */}
        {filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEventDeleted={handleEventDeleted}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <p className="text-white text-lg">
              Nenhum evento encontrado com os filtros selecionados
            </p>
            <button
              onClick={() => setFilter("all")}
              className="mt-2 text-orange-400 hover:text-orange-300 underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
