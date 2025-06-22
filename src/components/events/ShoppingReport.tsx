"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../lib/api";
import {
  EventShoppingStatisticsDTO,
  ItemUpdateDTO,
  ItemShoppingStatisticsDTO,
} from "../../types/api";
import Swal from "sweetalert2";

interface ShoppingReportProps {
  eventId: number;
  eventName: string;
  onClose: () => void;
  isAdmin: boolean;
}

interface ItemCardProps {
  item: ItemShoppingStatisticsDTO;
  isEditing: boolean;
  editingCost: number;
  onCostChange: (itemId: number, newCost: number) => void;
  totalParticipants: number;
  formatCurrency: (value: number) => string;
  getGenderIcon: (gender: string) => string;
  isAdmin: boolean;
  isPurchased: boolean;
  onTogglePurchased: (itemId: number) => void;
}

function ItemCard({
  item,
  isEditing,
  editingCost,
  onCostChange,
  totalParticipants,
  formatCurrency,
  getGenderIcon,
  isAdmin,
  isPurchased,
  onTogglePurchased,
}: ItemCardProps) {
  const isRequired = item.isRequired;
  const participantsCount = isRequired ? totalParticipants : item.totalChosenBy;
  const pricePerPerson = editingCost / participantsCount || 0;

  return (
    <div
      className={`border rounded-lg p-3 transition-all ${
        isPurchased
          ? "bg-green-50 border-green-200 opacity-75"
          : "border-gray-200"
      }`}
    >
      <div className="flex flex-col gap-3 mb-2">
        <div className="flex items-start gap-2">
          {isAdmin && (
            <button
              onClick={() => onTogglePurchased(item.itemId)}
              className={`mt-1 p-1 rounded-full transition-colors flex-shrink-0 ${
                isPurchased
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title={
                isPurchased
                  ? "Marcar como não comprado"
                  : "Marcar como comprado"
              }
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <h4
            className={`font-medium break-words flex-1 min-w-0 ${
              isPurchased ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {item.itemName}
          </h4>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {isEditing && isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editingCost > 0 ? editingCost : ""}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  const newValue =
                    inputValue === "" ? 0 : parseFloat(inputValue);
                  onCostChange(item.itemId, newValue);
                }}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                placeholder="0.00"
              />
            </div>
          ) : (
            <span
              className={`text-lg font-semibold ${
                isPurchased ? "text-green-500" : "text-green-600"
              }`}
            >
              {formatCurrency(editingCost)}
            </span>
          )}
        </div>
      </div>

      <div
        className={`text-sm space-y-1 ${
          isPurchased ? "text-gray-500" : "text-gray-600"
        }`}
      >
        <p>
          {isRequired ? "Pessoas que precisam" : "Quantidade escolhida"}:{" "}
          {participantsCount}
        </p>
        <p>Preço por pessoa: {formatCurrency(pricePerPerson)}</p>

        {/* Distribuição por gênero */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">Distribuição:</span>
          {item.maleCount > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {getGenderIcon("Male")} {item.maleCount}
            </span>
          )}
          {item.femaleCount > 0 && (
            <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
              {getGenderIcon("Female")} {item.femaleCount}
            </span>
          )}
          {item.unspecifiedCount > 0 && (
            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {getGenderIcon("Unspecified")} {item.unspecifiedCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShoppingReport({
  eventId,
  eventName,
  onClose,
  isAdmin,
}: ShoppingReportProps) {
  const [statistics, setStatistics] =
    useState<EventShoppingStatisticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCosts, setEditingCosts] = useState<{ [key: number]: number }>(
    {}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState<Set<number>>(new Set());
  const [showOnlyUnpurchased, setShowOnlyUnpurchased] = useState(false);

  // Chave para localStorage
  const storageKey = `purchasedItems_${eventId}`;

  useEffect(() => {
    loadStatistics();
    loadPurchasedItems();
  }, [eventId]);

  const loadPurchasedItems = () => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        // Verificar se os dados não são muito antigos (30 dias)
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        if (data.timestamp && data.timestamp > thirtyDaysAgo) {
          setPurchasedItems(new Set(data.itemIds));
        } else {
          // Dados muito antigos, limpar
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar itens comprados:", error);
    }
  };

  const savePurchasedItems = (itemIds: Set<number>) => {
    try {
      const data = {
        itemIds: Array.from(itemIds),
        timestamp: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar itens comprados:", error);
    }
  };

  const togglePurchasedItem = (itemId: number) => {
    const newPurchasedItems = new Set(purchasedItems);
    if (newPurchasedItems.has(itemId)) {
      newPurchasedItems.delete(itemId);
    } else {
      newPurchasedItems.add(itemId);
    }
    setPurchasedItems(newPurchasedItems);
    savePurchasedItems(newPurchasedItems);
  };

  const resetPurchasedItems = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Resetar lista de compras",
      text: "Tem certeza que deseja marcar todos os itens como não comprados?",
      confirmButtonText: "Sim, resetar",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setPurchasedItems(new Set());
      savePurchasedItems(new Set());
      Swal.fire({
        icon: "success",
        title: "Lista resetada!",
        text: "Todos os itens foram marcados como não comprados.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEventShoppingStatistics(eventId);
      setStatistics(data);
      // Inicializar os custos editáveis com os valores originais
      const initialCosts: { [key: number]: number } = {};
      data.items.forEach((item) => {
        initialCosts[item.itemId] = item.totalCost;
      });
      setEditingCosts(initialCosts);
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível carregar as estatísticas do evento.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCostChange = (itemId: number, newCost: number) => {
    const validCost = isNaN(newCost) ? 0 : newCost;

    setEditingCosts((prev) => ({
      ...prev,
      [itemId]: validCost,
    }));
  };

  const handleSaveCosts = async () => {
    try {
      const updatePromises = Object.entries(editingCosts).map(
        ([itemId, cost]) => {
          const item = statistics?.items.find(
            (i) => i.itemId === parseInt(itemId)
          );
          if (item && cost !== item.totalCost) {
            const updateData: ItemUpdateDTO = {
              name: item.itemName,
              isRequired: item.isRequired,
              totalCost: cost,
            };
            return apiService.updateItem(parseInt(itemId), updateData);
          }
          return Promise.resolve();
        }
      );

      await Promise.all(updatePromises);

      // Recarregar estatísticas
      await loadStatistics();

      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Custos atualizados com sucesso!",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Erro ao atualizar custos:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Falha ao atualizar os custos dos itens.",
      });
    }
  };

  const handleCancelEdit = () => {
    // Restaurar custos originais
    if (statistics) {
      const originalCosts: { [key: number]: number } = {};
      statistics.items.forEach((item) => {
        originalCosts[item.itemId] = item.totalCost;
      });
      setEditingCosts(originalCosts);
    }
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "Male":
        return "👨";
      case "Female":
        return "👩";
      default:
        return "👤";
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-700">Carregando relatório...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  // Filtrar itens baseado no estado de compra
  const filteredItems = showOnlyUnpurchased
    ? statistics.items.filter((item) => !purchasedItems.has(item.itemId))
    : statistics.items;

  const totalCost = Object.values(editingCosts).reduce(
    (sum, cost) => sum + (cost || 0),
    0
  );
  const requiredItems = filteredItems.filter((item) => item.isRequired);
  const optionalItems = filteredItems.filter((item) => !item.isRequired);

  const purchasedCount = purchasedItems.size;
  const totalItems = statistics.items.length;
  const unpurchasedCount = totalItems - purchasedCount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-lg z-10 relative">
          {/* Botão fechar - posicionado absolutamente no canto superior direito */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pr-12">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                Lista de Compras
              </h2>
              <p className="text-sm text-gray-600 break-words mt-1">
                {eventName}
              </p>
              {isAdmin && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-sm">
                  <span className="text-gray-600">
                    {purchasedCount}/{totalItems} itens comprados
                  </span>
                  <button
                    onClick={() => setShowOnlyUnpurchased(!showOnlyUnpurchased)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors w-fit ${
                      showOnlyUnpurchased
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {showOnlyUnpurchased
                      ? "Mostrar todos"
                      : `Mostrar apenas não comprados (${unpurchasedCount})`}
                  </button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isAdmin && (
                <button
                  onClick={resetPurchasedItems}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  title="Resetar lista de compras"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Resetar
                </button>
              )}
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveCosts}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cancelar
                  </button>
                </div>
              ) : isAdmin ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar Custos
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Resumo */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              Resumo do Evento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total de participantes:</span>
                <span className="ml-2 font-medium text-blue-900">
                  {statistics.totalParticipants}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Custo total:</span>
                <span className="ml-2 font-medium text-blue-900">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              {isAdmin && (
                <>
                  <div>
                    <span className="text-blue-700">Itens comprados:</span>
                    <span className="ml-2 font-medium text-blue-900">
                      {purchasedCount}/{totalItems}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Itens pendentes:</span>
                    <span className="ml-2 font-medium text-blue-900">
                      {unpurchasedCount}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Itens Obrigatórios */}
          {requiredItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs mr-2">
                  OBRIGATÓRIO
                </span>
                Itens Obrigatórios
              </h3>
              <div className="space-y-3">
                {requiredItems.map((item) => {
                  const editingCost =
                    editingCosts[item.itemId] ?? item.totalCost;
                  const isPurchased = purchasedItems.has(item.itemId);
                  return (
                    <ItemCard
                      key={item.itemId}
                      item={item}
                      isEditing={isEditing}
                      editingCost={editingCost}
                      onCostChange={handleCostChange}
                      totalParticipants={statistics.totalParticipants}
                      formatCurrency={formatCurrency}
                      getGenderIcon={getGenderIcon}
                      isAdmin={isAdmin}
                      isPurchased={isPurchased}
                      onTogglePurchased={togglePurchasedItem}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Itens Opcionais */}
          {optionalItems.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                  OPCIONAL
                </span>
                Itens Opcionais
              </h3>
              <div className="space-y-3">
                {optionalItems.map((item) => {
                  const editingCost =
                    editingCosts[item.itemId] ?? item.totalCost;
                  const isPurchased = purchasedItems.has(item.itemId);
                  return (
                    <ItemCard
                      key={item.itemId}
                      item={item}
                      isEditing={isEditing}
                      editingCost={editingCost}
                      onCostChange={handleCostChange}
                      totalParticipants={statistics.totalParticipants}
                      formatCurrency={formatCurrency}
                      getGenderIcon={getGenderIcon}
                      isAdmin={isAdmin}
                      isPurchased={isPurchased}
                      onTogglePurchased={togglePurchasedItem}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-900">
                Total Geral
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
