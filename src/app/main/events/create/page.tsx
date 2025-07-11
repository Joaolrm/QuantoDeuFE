// src/app/main/events/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiService } from "@/lib/api";
import { CreateEventRequest, ItemCutIdEventIdTotalCostDTO } from "@/types/api";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { EventItemForm } from "@/components/events/EventItemForm";
import Swal from "sweetalert2";
import { BackButton } from "@/components/ui/BackButton";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemCutIdEventIdTotalCostDTO[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    address: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    const updatedItem = { ...newItems[index] };

    if (field === "name") {
      updatedItem.name = value;
    } else if (field === "isRequired") {
      updatedItem.isRequired = value;
      // Se tornou obrigatório, garantir que ownerWantsThisItem seja true
      if (value === true) {
        updatedItem.ownerWantsThisItem = true;
      }
    } else if (field === "ownerWantsThisItem") {
      updatedItem.ownerWantsThisItem = value;
    }

    newItems[index] = updatedItem;
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([
      { name: "", isRequired: false, ownerWantsThisItem: true },
      ...items,
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 0) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.date || !formData.address) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Preencha todos os campos obrigatórios",
      });
      setLoading(false);
      return;
    }

    try {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const eventData: CreateEventRequest = {
        ...formData,
        eventOwnerId: user.id,
        itens: items.map((item) => ({
          name: item.name,
          isRequired: item.isRequired,
          ownerWantsThisItem: item.ownerWantsThisItem,
        })),
      };

      await apiService.createEvent(eventData);
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Evento criado com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
      router.push("/main");
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao criar evento",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/churrasco.jpg')" }}
    >
      <div className="backdrop-blur-sm bg-black/30 rounded-lg p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <BackButton href="/main" />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">Criar Novo Evento</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-1">Nome do Evento*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-white/90 text-gray-800"
              placeholder="Ex: Churrasco de Domingo"
              maxLength={60}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.name.length}/60 caracteres
            </p>
          </div>

          <div>
            <label className="block text-white mb-1">Data*</label>
            <input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-white/90 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-1">Endereço*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-white/90 text-gray-800"
              placeholder="Ex: Rua Otto Niemeyer, 26"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.address.length}/100 caracteres
            </p>
          </div>

          {/* Lista de itens - agora opcional */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Itens do Evento (Opcional)
              </h2>
              <button
                type="button"
                onClick={addNewItem}
                className="bg-amber-600 text-white py-1 px-3 rounded text-sm hover:bg-amber-700 transition-colors"
              >
                Adicionar Item
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-4 text-white/70">
                Nenhum item adicionado ainda. Você pode adicionar itens depois
                de criar o evento.
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <EventItemForm
                    key={index}
                    item={item}
                    index={index}
                    onItemChange={handleItemChange}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Criando..." : "Criar Evento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
