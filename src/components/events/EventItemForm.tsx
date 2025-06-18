"use client";

import { ChangeEvent } from "react";
import { ItemCutIdEventIdTotalCostDTO } from "@/lib/api";

type EventItemFormProps = {
  item: ItemCutIdEventIdTotalCostDTO;
  index: number;
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
};

export function EventItemForm({
  item,
  index,
  onItemChange,
  onRemoveItem,
}: EventItemFormProps) {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    // Se estamos mudando isRequired para true, também definir ownerWantsThisItem como true
    if (field === "isRequired" && value === "true") {
      onItemChange(index, field, true);
      onItemChange(index, "ownerWantsThisItem", true);
    } else {
      onItemChange(
        index,
        field,
        field === "isRequired" ? value === "true" : value
      );
    }
  };

  // Função específica para lidar com a mudança do checkbox "Eu vou querer"
  const handleOwnerWantsChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Só permite mudança se o item não for obrigatório
    if (!item.isRequired) {
      onItemChange(index, "ownerWantsThisItem", e.target.checked);
    }
  };

  // Determina o valor do checkbox baseado na lógica do negócio
  const getOwnerWantsValue = (): boolean => {
    if (item.isRequired) {
      return true; // Sempre true para itens obrigatórios
    }
    return item.ownerWantsThisItem ?? true; // Para itens opcionais, usa o valor do item ou true como padrão
  };

  return (
    <div className="bg-white/10 p-3 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        <div>
          <label className="block text-white text-sm mb-1">Nome do Item*</label>
          <input
            type="text"
            value={item.name || ""}
            onChange={(e) => handleInputChange(e, "name")}
            className="w-full p-2 rounded bg-white/90 text-gray-800 text-sm"
            placeholder="Ex: Carne, Bebidas"
            required
          />
        </div>

        <div>
          <label className="block text-white text-sm mb-1">Tipo</label>
          <select
            value={item.isRequired.toString()}
            onChange={(e) => handleInputChange(e, "isRequired")}
            className="w-full p-2 rounded bg-white/90 text-gray-800 text-sm"
          >
            <option value="true">Obrigatório</option>
            <option value="false">Opcional</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 text-white text-sm">
            <input
              type="checkbox"
              checked={getOwnerWantsValue()}
              onChange={handleOwnerWantsChange}
              className={`rounded bg-white/90 ${
                item.isRequired ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={item.isRequired}
            />
            <span>Eu vou querer</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onRemoveItem(index)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
