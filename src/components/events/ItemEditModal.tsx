import { useState, useEffect } from "react";
import { ItemAddParticipantsCutEventIdDTO, ItemUpdateDTO } from "@/types/api";
import Swal from "sweetalert2";

interface ItemEditModalProps {
  item: ItemAddParticipantsCutEventIdDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemId: number, itemData: ItemUpdateDTO) => Promise<void>;
}

export function ItemEditModal({
  item,
  isOpen,
  onClose,
  onSave,
}: ItemEditModalProps) {
  const [formData, setFormData] = useState<ItemUpdateDTO>({
    name: "",
    isRequired: false,
    totalCost: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        isRequired: item.isRequired,
        totalCost: item.totalCost,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!formData.name.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Campo obrigatório",
        text: "O nome do item é obrigatório",
      });
      return;
    }

    if (formData.totalCost < 0) {
      await Swal.fire({
        icon: "warning",
        title: "Valor inválido",
        text: "O custo total deve ser um valor positivo",
      });
      return;
    }

    setLoading(true);
    try {
      await onSave(item.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating item:", error);
      await Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao atualizar item",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#330000]/95 rounded-lg p-6 w-full max-w-md backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-4">Editar Item</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white mb-1"
            >
              Nome do Item
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              autoFocus
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nome do item"
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.name.length}/50 caracteres
            </p>
          </div>

          <div>
            <label
              htmlFor="totalCost"
              className="block text-sm font-medium text-white mb-1"
            >
              Custo Total (R$)
            </label>
            <input
              type="number"
              id="totalCost"
              name="totalCost"
              value={formData.totalCost}
              onChange={handleInputChange}
              onFocus={(e) => e.target.select()}
              step="0.01"
              min="0"
              className="w-full rounded-md border border-gray-400 bg-[#550000] text-white p-3 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="isRequired" className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRequired"
                name="isRequired"
                checked={formData.isRequired}
                onChange={handleInputChange}
                className="rounded border-gray-400 bg-[#550000] text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-white">
                Item obrigatório
              </span>
            </label>
            <p className="text-xs text-gray-300 mt-1">
              Itens obrigatórios são automaticamente incluídos para todos os
              participantes
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
