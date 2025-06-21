"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { EventAddItemsCutEventIdTotalCostDTO, ItemCutEventIdTotalCostDTO, PeopleAddPeopleIdSelectedOptionalItemsIdCutIdNamePhoneNumberDateOfBirthGenderDTO } from "@/types/api";
import Swal from "sweetalert2";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { BackButton } from "@/components/ui/BackButton";

export default function JoinEventPage() {
  const { hash } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventAddItemsCutEventIdTotalCostDTO | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadEvent() {
      try {
        if (hash) {
          const eventData = await apiService.getEventByHashInvite(hash as string);
          setEvent(eventData);
          
          // Pré-seleciona itens obrigatórios
          const requiredItems = eventData.items
            .filter(item => item.isRequired)
            .map(item => item.id);
          setSelectedItems(requiredItems);
        }
      } catch (error) {
        console.error("Error loading event:", error);
        await Swal.fire({
          icon: "error",
          title: "Evento não encontrado",
          text: "O link de convite é inválido ou o evento não existe.",
        });
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      loadEvent();
    }
  }, [hash, authLoading, router]);

  useEffect(() => {
    // Se não está autenticado, redireciona para login
    if (!authLoading && !user) {
      router.push(`/login?redirect=/join/${hash}`);
    }
  }, [user, authLoading, hash, router]);

  const handleItemToggle = (itemId: number) => {
    setSelectedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleJoinEvent = async () => {
    if (!user || !event) return;

    setSubmitting(true);
    try {
      const participantData: PeopleAddPeopleIdSelectedOptionalItemsIdCutIdNamePhoneNumberDateOfBirthGenderDTO = {
        peopleId: user.id,
        selectedOptionalItemsId: selectedItems.filter(itemId => {
          const item = event.items.find(i => i.id === itemId);
          return item && !item.isRequired;
        }),
      };

      await apiService.addParticipantToEvent(event.id, participantData);

      await Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Você foi adicionado ao evento com sucesso!",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redireciona para a página do evento
      router.push(`/main/events/${event.id}`);
    } catch (error) {
      console.error("Error joining event:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao participar do evento. Tente novamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null; // Será redirecionado pelo useEffect
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Evento não encontrado</div>
      </div>
    );
  }

  const requiredItems = event.items.filter(item => item.isRequired);
  const optionalItems = event.items.filter(item => !item.isRequired);

  return (
    <div
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/churrasco.jpg')" }}
    >
      <div className="backdrop-blur-sm bg-black/30 rounded-lg p-6 max-w-4xl mx-auto">
        {/* Header com botão de voltar */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton onClick={() => router.push("/main")} />
          <div className="flex-1">
            {/* Segunda linha: Título e informações do evento */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
                {event.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="break-words">{event.address}</span>
                </div>
              </div>
              <p className="text-amber-400 text-sm mt-2">
                Você está prestes a participar deste evento!
              </p>
            </div>
          </div>
        </div>

        {/* Itens Obrigatórios */}
        {requiredItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Itens Obrigatórios (incluídos automaticamente)
            </h2>
            <div className="space-y-3">
              {requiredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/10 p-4 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-medium">{item.name}</h3>
                    <p className="text-gray-300 text-sm">Item obrigatório</p>
                  </div>
                  <div className="text-green-400 text-lg">✓</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Itens Opcionais */}
        {optionalItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-3">
              Itens Opcionais (selecione os que deseja)
            </h2>
            <div className="space-y-3">
              {optionalItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white/10 p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedItems.includes(item.id)
                      ? "border-2 border-amber-400 bg-amber-400/10"
                      : "border border-transparent hover:bg-white/20"
                  }`}
                  onClick={() => handleItemToggle(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-gray-300 text-sm">Item opcional</p>
                    </div>
                    <div className={`text-2xl ${selectedItems.includes(item.id) ? "text-amber-400" : "text-gray-400"}`}>
                      {selectedItems.includes(item.id) ? "✓" : "○"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {optionalItems.length === 0 && requiredItems.length === 0 && (
          <div className="mb-6">
            <p className="text-gray-300 text-center py-8">
              Este evento ainda não possui itens cadastrados.
            </p>
          </div>
        )}

        {/* Resumo */}
        <div className="bg-white/10 p-4 rounded-lg mb-6">
          <h3 className="text-white font-semibold mb-2">Resumo da sua participação:</h3>
          <p className="text-gray-300">
            • Itens obrigatórios: {requiredItems.length}
          </p>
          <p className="text-gray-300">
            • Itens opcionais selecionados: {selectedItems.filter(id => {
              const item = event.items.find(i => i.id === id);
              return item && !item.isRequired;
            }).length}
          </p>
        </div>

        {/* Botões de ação */}
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/main")}
            className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleJoinEvent}
            disabled={submitting}
            className="flex-1 bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {submitting ? "Participando..." : "Participar do Evento"}
          </button>
        </div>
      </div>
    </div>
  );
} 