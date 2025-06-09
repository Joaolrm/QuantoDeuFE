// src/app/main/events/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  apiService,
  EventAddPeopleItemsParticipantsCutEventIdDTO,
  ItemAddParticipantsCutEventIdDTO,
  ItemCutIdDTO,
  AddItemToParticipantDTO,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";
import { EventItemForm } from "@/components/events/EventItemForm";

export default function EventPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] =
    useState<EventAddPeopleItemsParticipantsCutEventIdDTO | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
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
        toast.error("Falha ao carregar detalhes do evento");
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
      const selectedItems = event.itens
        .filter(
          (item) =>
            !item.isRequired && item.participants.some((p) => p.id === user.id)
        )
        .map((item) => item.id);

      const item = event.itens.find((i) => i.id === itemId);
      if (!item) return;

      // Toggle selection
      const newSelectedItems = item.participants.some((p) => p.id === user.id)
        ? selectedItems.filter((id) => id !== itemId)
        : [...selectedItems, itemId];

      await apiService.addParticipantToEvent(event.id, {
        peopleId: user.id,
        selectedOptionalItemsId: newSelectedItems,
      });

      // Atualiza o estado local
      const updatedEvent = { ...event };
      const updatedItem = updatedEvent.itens.find((i) => i.id === itemId);
      if (updatedItem) {
        if (updatedItem.participants.some((p) => p.id === user.id)) {
          updatedItem.participants = updatedItem.participants.filter(
            (p) => p.id !== user.id
          );
        } else {
          updatedItem.participants = [
            ...updatedItem.participants,
            { id: user.id, name: user.name },
          ];
        }
      }
      setEvent(updatedEvent);

      toast.success("Participação atualizada!");
    } catch (error) {
      console.error("Error updating participation:", error);
      toast.error("Falha ao atualizar participação");
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
      toast.success("Item adicionado com sucesso!");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Falha ao adicionar item");
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!event || !user?.id) return;

    try {
      await apiService.deleteItem(itemId);

      // Recarrega os detalhes do evento
      const eventData = await apiService.getEventDetails(event.id, user.id);
      setEvent(eventData);
      toast.success("Item removido com sucesso!");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Falha ao remover item");
    }
  };

  const copyInviteLink = () => {
    if (!event) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${event.hashInvite}`
    );
    toast.success("Link de convite copiado!");
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

          <button
            onClick={copyInviteLink}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Compartilhar Evento
          </button>
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
                  setNewItem((prev) => ({
                    ...prev,
                    [field]: field === "name" ? value : value === "true",
                  }));
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
    </div>
  );
}

interface ItemCardProps {
  item: ItemAddParticipantsCutEventIdDTO;
  currentUserId?: number;
  onToggle: (itemId: number) => void;
  isAdmin: boolean;
  onDelete: (itemId: number) => void;
}

function ItemCard({
  item,
  currentUserId,
  onToggle,
  isAdmin,
  onDelete,
}: ItemCardProps) {
  const isCurrentUserParticipating = currentUserId
    ? item.participants.some((p) => p.id === currentUserId)
    : false;

  return (
    <div className="bg-white/10 p-4 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium text-white">
            {item.name}
            <span className="ml-2 text-sm text-amber-400">
              {item.isRequired ? "(Obrigatório)" : "(Opcional)"}
            </span>
          </h3>
          <p className="text-gray-300 text-sm">
            R$ {item.totalCost.toFixed(2)}
          </p>
        </div>

        {!item.isRequired && (
          <button
            onClick={() => onToggle(item.id)}
            className={`py-1 px-3 rounded text-sm ${
              isCurrentUserParticipating
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700"
            } text-white transition-colors`}
          >
            {isCurrentUserParticipating ? "Quero" : "Não quero"}
          </button>
        )}
      </div>

      {/* Lista de participantes */}
      {item.participants.length > 0 && (
        <div className="mt-2">
          <p className="text-gray-300 text-sm mb-1">Participantes:</p>
          <div className="flex flex-wrap gap-2">
            {item.participants.map((participant) => (
              <span
                key={participant.id}
                className="bg-white/10 text-white text-xs px-2 py-1 rounded"
              >
                {participant.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botão de excluir (apenas para admin) */}
      {isAdmin && !item.isRequired && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => onDelete(item.id)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Remover Item
          </button>
        </div>
      )}
    </div>
  );
}
