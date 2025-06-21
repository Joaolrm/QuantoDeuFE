"use client";

import { ChangeEvent } from "react";
import { ItemCutIdEventIdTotalCostDTO } from "@/types/api";

interface EventItemFormProps {
  item: ItemCutIdEventIdTotalCostDTO;
  index: number;
  onItemChange: (index: number, field: string, value: any) => void;
  onRemoveItem: (index: number) => void;
}

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
      field === "isRequired"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    onItemChange(index, field, value);
  };

  const handleOwnerWantsChange = (e: ChangeEvent<HTMLInputElement>) => {
    onItemChange(index, "ownerWantsThisItem", e.target.checked);
  };

  return (
    <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex justify-between items-center">
        <h4 className="text-white font-medium">Item {index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemoveItem(index)}
          className="text-red-400 hover:text-red-300 text-sm"
        >
          Remover
        </button>
      </div>

      <div>
        <label className="block text-white text-sm mb-1">
          Nome do Item*
        </label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => handleInputChange(e, "name")}
          className="w-full p-2 rounded bg-white/90 text-gray-800 text-sm"
          placeholder="Ex: Carne, Bebidas, etc."
          maxLength={50}
          required
        />
        <p className="text-xs text-gray-400 mt-1">
          {item.name.length}/50 caracteres
        </p>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-white text-sm">
          <input
            type="checkbox"
            checked={item.isRequired}
            onChange={(e) => handleInputChange(e, "isRequired")}
            className="rounded border-gray-400 bg-[#550000] text-orange-500 focus:ring-orange-500"
          />
          Item obrigatório
        </label>

        {!item.isRequired && (
          <label className="flex items-center gap-2 text-white text-sm">
            <input
              type="checkbox"
              checked={item.ownerWantsThisItem}
              onChange={handleOwnerWantsChange}
              className="rounded border-gray-400 bg-[#550000] text-orange-500 focus:ring-orange-500"
            />
            Eu quero este item
          </label>
        )}
      </div>
    </div>
  );
}
