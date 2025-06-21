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
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{event.name}</h1>
            <p className="text-gray-300">
              {new Date(event.date).toLocaleDateString()} • {event.address}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {event && (
              <ShareButton
                title={`Convite para: ${event.name}`}
                text={`Você foi convidado para participar do evento "${event.name}"!`}
                url={`${window.location.origin}/join/${event.hashInvite}`}
              />
            )}
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Itens do Evento
            </h2>
            {isAdmin && (
              <button
                onClick={() => setShowAddItemForm(!showAddItemForm)}
                className="bg-amber-600 text-white py-1 px-3 rounded text-sm hover:bg-amber-700 transition-colors"
              >
                {showAddItemForm ? "Cancelar" : "Adicionar Item"}
              </button>
            )}
          </div>

          {/* Formulário para adicionar novo item */}
          {showAddItemForm && isAdmin && (
            <div className="bg-white/10 p-4 rounded-lg mb-4">
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
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddItem}
                  className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          )}

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

        <div className="mt-6">
          <Link
            href="/main"
            className="text-white hover:text-amber-300 transition-colors"
          >
            Voltar para Meus Eventos
          </Link>
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
