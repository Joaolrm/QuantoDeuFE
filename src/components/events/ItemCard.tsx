import { ItemAddParticipantsCutEventIdDTO } from "@/types/api";

interface ItemCardProps {
  item: ItemAddParticipantsCutEventIdDTO;
  currentUserId?: number;
  onToggle: (itemId: number) => void;
  isAdmin: boolean;
  onDelete: (itemId: number) => void;
  onEdit: (item: ItemAddParticipantsCutEventIdDTO) => void;
}

export function ItemCard({
  item,
  currentUserId,
  onToggle,
  isAdmin,
  onDelete,
  onEdit,
}: ItemCardProps) {
  const isCurrentUserParticipating = currentUserId
    ? item.participants.some((p) => p.id === currentUserId)
    : false;

  return (
    <div className="bg-white/10 p-4 rounded-lg">
      {/* Cabeçalho do item */}
      <div className="mb-3">
        <h3 className="text-lg font-medium text-white">
          {item.name}
          <span className="ml-2 text-sm text-amber-400">
            {item.isRequired ? "(Obrigatório)" : "(Opcional)"}
          </span>
        </h3>
        <p className="text-gray-300 text-sm">R$ {item.totalCost.toFixed(2)}</p>
      </div>

      {/* Lista de participantes */}
      {item.participants.length > 0 && (
        <div className="mb-4">
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

      {/* Área de ações - botões organizados */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
        {/* Botão de participação - sempre visível e intuitivo */}
        {!item.isRequired && currentUserId && (
          <button
            onClick={() => onToggle(item.id)}
            className={`w-full sm:w-auto py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isCurrentUserParticipating
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
          >
            {isCurrentUserParticipating ? (
              <>
                <span className="text-lg">✓</span>
                <span>Eu quero este item</span>
              </>
            ) : (
              <>
                <span className="text-base">X</span>
                <span>Eu quero este item</span>
              </>
            )}
          </button>
        )}

        {/* Botões de admin - apenas para admins */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Botão de editar - apenas para admin */}
            <button
              onClick={() => onEdit(item)}
              className="w-full sm:w-auto text-blue-400 hover:text-blue-300 text-sm py-3 px-4 rounded-lg hover:bg-blue-400/10 transition-colors border border-blue-400/30 flex items-center justify-center gap-2"
            >
              <span className="text-lg">✏️</span>
              <span>Editar Item</span>
            </button>

            {/* Botão de excluir - apenas para admin */}
            <button
              onClick={() => onDelete(item.id)}
              className="w-full sm:w-auto text-red-400 hover:text-red-300 text-sm py-3 px-4 rounded-lg hover:bg-red-400/10 transition-colors border border-red-400/30 flex items-center justify-center gap-2"
            >
              <span className="text-lg">🗑️</span>
              <span>Remover Item</span>
            </button>
          </div>
        )}

        {/* Espaçador quando não há botões */}
        {(!currentUserId || item.isRequired) && !isAdmin && (
          <div className="h-12"></div>
        )}
      </div>
    </div>
  );
}
