// src/app/main/events/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api";
import {
  EventAddPeopleItemsParticipantsCutEventIdDTO,
  ItemAddParticipantsCutEventIdDTO,
  ItemCutIdDTO,
  AddItemToParticipantDTO,
  ItemUpdateDTO,
} from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { EventItemForm } from "@/components/events/EventItemForm";
import { ItemEditModal } from "@/components/events/ItemEditModal";
import Swal from "sweetalert2";
import { ItemCard } from "@/components/events/ItemCard";
import { ShareButton } from "@/components/ui/ShareButton";
import { BackButton } from "@/components/ui/BackButton";

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] =
    useState<EventAddPeopleItemsParticipantsCutEventIdDTO | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<ItemAddParticipantsCutEventIdDTO | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    isRequired: false,
    ownerWantsThisItem: true,
  });

  useEffect(() => {
    async function loadEventDetails() {
      try {
        if (user?.id) {
          const eventData = await apiService.getEventDetails(
            Number(id),
            user.id
          );
          setEvent(eventData);
        }
      } catch (error) {
        console.error("Error loading event details:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Falha ao carregar detalhes do evento",
        });
        router.push("/main");
      } finally {
        setLoading(false);
      }
    }

    loadEventDetails();
  }, [id, user?.id, router]);

  const handleToggleItem = async (itemId: number) => {
    if (!user?.id || !event) return;

    try {
      const item = event.itens.find((i) => i.id === itemId);
      if (!item) return;

      const isCurrentlyParticipating = item.participants.some(
        (p) => p.id === user.id
      );

      if (isCurrentlyParticipating) {
        // Remove o participante do item
        await apiService.removeItemFromParticipant(itemId, user.id, event.id);
      } else {
        // Adiciona o participante ao item
        const participantData: AddItemToParticipantDTO = {
          eventId: event.id,
          peopleId: user.id,
        };
        await apiService.addItemToParticipant(itemId, participantData);
      }

      // Recarrega os detalhes do evento para obter dados atualizados
      const eventData = await apiService.getEventDetails(event.id, user.id);
      setEvent(eventData);

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: isCurrentlyParticipating
          ? "Item removido da sua lista!"
          : "Item adicionado à sua lista!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating participation:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao atualizar participação",
      });
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !event || !user?.id) return;
    try {
      // Cria o novo item
      const itemData: ItemCutIdDTO = {
        name: newItem.name,
        eventId: event.id,
        isRequired: newItem.isRequired,
      };

      const createdItem = await apiService.createItem(itemData);

      // Se o dono quer o item e não é obrigatório, adiciona como participante
      if (newItem.ownerWantsThisItem && !newItem.isRequired) {
        const participantData: AddItemToParticipantDTO = {
          eventId: event.id,
          peopleId: user.id,
        };
        await apiService.addItemToParticipant(createdItem.id, participantData);
      }

      // Recarrega os detalhes do evento
      const eventData = await apiService.getEventDetails(event.id, user.id);
      setEvent(eventData);
      setNewItem({
        name: "",
        isRequired: false,
        ownerWantsThisItem: true,
      });
      setShowAddItemForm(false);
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Item adicionado com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding item:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao adicionar item",
      });
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Tem certeza que deseja deletar o item?",
      text: "O item será removido de todos os usuários.",
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    if (!event || !user?.id) return;

    try {
      await apiService.deleteItem(itemId);

      // Recarrega os detalhes do evento
      const eventData = await apiService.getEventDetails(event.id, user.id);
      setEvent(eventData);
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Item removido com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao remover item",
      });
    }
  };

  const handleEditItem = (item: ItemAddParticipantsCutEventIdDTO) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleUpdateItem = async (itemId: number, itemData: ItemUpdateDTO) => {
    if (!event || !user?.id) return;

    try {
      await apiService.updateItem(itemId, itemData);

      // Recarrega os detalhes do evento
      const eventData = await apiService.getEventDetails(event.id, user.id);
      setEvent(eventData);

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Item atualizado com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Evento não encontrado</div>
      </div>
    );
  }

  const isAdmin = event.actualUser.admin;

  return (
    <div
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/churrasco.jpg')" }}
    >
      <div className="backdrop-blur-sm bg-black/30 rounded-lg p-6 max-w-4xl mx-auto">
        {/* Header com botão de voltar e informações do evento */}
        <div className="mb-6">
          {/* Primeira linha: Botão voltar e botão compartilhar */}
          <div className="flex justify-between items-center mb-4">
            <BackButton href="/main" />
            {event && (
              <ShareButton
                title={`Convite para: ${event.name}`}
                text={`Você foi convidado para participar do evento "${event.name}"!`}
                url={`${window.location.origin}/join/${event.hashInvite}`}
              />
            )}
          </div>
          
          {/* Segunda linha: Título e informações do evento */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white break-words">
              {event.name}
            </h1>
            <div className="flex flex-col gap-2 text-gray-300">
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
                <span className="break-words flex-1 min-w-0">{event.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-4 mb-8">
          {/* Header da seção de itens */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Itens do Evento
              </h2>
              <p className="text-gray-300 text-sm">
                Gerencie os itens e veja quem vai trazer o quê
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowAddItemForm(!showAddItemForm)}
                className="bg-amber-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-amber-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {showAddItemForm ? "Cancelar" : "Adicionar Item"}
              </button>
            )}
          </div>

          {/* Formulário para adicionar novo item */}
          {showAddItemForm && isAdmin && (
            <div className="bg-white/10 p-4 rounded-lg mb-4 border border-white/20">
              <h3 className="text-white font-medium mb-3">Novo Item</h3>
              <EventItemForm
                item={newItem}
                index={0}
                onItemChange={(index, field, value) => {
                  setNewItem((prev) => {
                    const updated = { ...prev };

                    if (field === "name") {
                      updated.name = value;
                    } else if (field === "isRequired") {
                      updated.isRequired = value;
                      // Se tornou obrigatório, garantir que ownerWantsThisItem seja true
                      if (value === true) {
                        updated.ownerWantsThisItem = true;
                      }
                    } else if (field === "ownerWantsThisItem") {
                      updated.ownerWantsThisItem = value;
                    }

                    return updated;
                  });
                }}
                onRemoveItem={() => setShowAddItemForm(false)}
              />
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleAddItem}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirmar
                </button>
              </div>
            </div>
          )}

          {/* Lista de itens */}
          <div className="space-y-3">
            {event.itens.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                currentUserId={user?.id}
                onToggle={handleToggleItem}
                isAdmin={isAdmin}
                onDelete={handleDeleteItem}
                onEdit={handleEditItem}
              />
            ))}
          </div>

          {/* Mensagem quando não há itens */}
          {event.itens.length === 0 && (
            <div className="text-center py-8 bg-white/5 rounded-lg border border-white/10">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-300 text-lg">Nenhum item cadastrado ainda</p>
              <p className="text-gray-400 text-sm mt-1">
                {isAdmin ? "Adicione itens para começar!" : "Aguarde o admin adicionar itens."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de edição de item */}
      <ItemEditModal
        item={editingItem}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
        }}
        onSave={handleUpdateItem}
      />
    </div>
  );
}
