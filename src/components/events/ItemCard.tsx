import { ItemAddParticipantsCutEventIdDTO } from "@/types/api";

interface ItemCardProps {
  item: ItemAddParticipantsCutEventIdDTO;
  currentUserId?: number;
  onToggle: (itemId: number) => void;
  isAdmin: boolean;
  onDelete: (itemId: number) => void;
}

export function ItemCard({
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

        {/* Botão de participação - não aparece para itens obrigatórios */}
        {!item.isRequired && currentUserId && (
          <button
            onClick={() => onToggle(item.id)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              isCurrentUserParticipating
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                : "bg-gray-600 hover:bg-gray-700 text-white"
            }`}
            title={
              isCurrentUserParticipating
                ? "Clique para não querer"
                : "Clique para querer"
            }
          >
            {isCurrentUserParticipating ? (
              <span className="flex items-center gap-1">
                <span>✓</span>
                Quero
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>○</span>
                Não quero
              </span>
            )}
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
      {isAdmin && (
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
