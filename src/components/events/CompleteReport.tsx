"use client";

import { useState, useEffect } from "react";
import { apiService } from "../../lib/api";
import { EventCompleteReportDTO } from "../../types/api";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

interface CompleteReportProps {
  eventId: number;
  eventName: string;
  onClose: () => void;
}

export default function CompleteReport({
  eventId,
  eventName,
  onClose,
}: CompleteReportProps) {
  const [report, setReport] = useState<EventCompleteReportDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [eventId]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await apiService.getEventCompleteReport(eventId);
      setReport(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível carregar o relatório do evento.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const generateExcel = () => {
    if (!report) return;

    // --- 1. Preparar os dados ---
    const eventInfo = [
      ["RELATÓRIO DE DIVISÃO DE CUSTOS"],
      [],
      ["INFORMAÇÕES DO EVENTO"],
      ["Nome do Evento", report.eventName],
      ["Data", formatDate(report.eventDate)],
      ["Endereço", report.eventAddress],
      ["Total de Participantes", report.totalParticipants.toString()],
      ["Custo Total", report.totalEventCost.toString()],
    ];

    const tableHeader = [
      "Participante",
      ...report.items.map((item) => item.itemName),
      "TOTAL",
    ];

    const tableBody = report.participants.map((participant) => {
      const row: (string | number)[] = [participant.name];
      report.items.forEach((item) => {
        const responsibleItem = participant.itemsResponsible.find(
          (resp) => resp.itemId === item.itemId
        );
        row.push(responsibleItem ? responsibleItem.individualCost : "");
      });
      row.push(participant.totalCost);
      return row;
    });

    const totalRow: (string | number)[] = ["TOTAL"];
    report.items.forEach((item) => totalRow.push(item.totalCost));
    totalRow.push(report.totalEventCost);

    // --- 2. Criar a planilha ---
    const ws = XLSX.utils.aoa_to_sheet(eventInfo);
    XLSX.utils.sheet_add_aoa(ws, [tableHeader], { origin: "A10" });
    XLSX.utils.sheet_add_aoa(ws, tableBody, { origin: "A11" });
    XLSX.utils.sheet_add_aoa(ws, [totalRow], {
      origin: "A" + (11 + tableBody.length),
    });

    // --- 3. Adicionar Formatação ---
    const currencyFormat = "R$ #,##0.00";
    const totalRowIndex = 11 + tableBody.length;

    // Formatar células de custo
    for (let R = 10; R < totalRowIndex; ++R) {
      for (let C = 1; C < tableHeader.length; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellAddress];
        if (cell && typeof cell.v === "number") {
          cell.z = currencyFormat;
        }
      }
    }
    // Formatar linha de total
    for (let C = 1; C < tableHeader.length; ++C) {
      const cellAddress = XLSX.utils.encode_cell({
        r: totalRowIndex - 1,
        c: C,
      });
      const cell = ws[cellAddress];
      if (cell && typeof cell.v === "number") {
        cell.z = currencyFormat;
      }
    }
    const costCell = ws["B8"];
    if (costCell) costCell.z = currencyFormat;

    // Ajustar largura das colunas
    const colWidths = tableHeader.map((h) => ({ wch: h.length + 5 }));
    colWidths[0].wch = 30; // Largura para coluna de participantes
    ws["!cols"] = colWidths;

    // --- 4. Gerar e baixar o arquivo ---
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Relatorio");
    XLSX.writeFile(
      wb,
      `relatorio_${report.eventName.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`
    );
  };

  const generateWhatsAppText = () => {
    if (!report) return;

    const text = `*RELATÓRIO DE DIVISÃO DE CUSTOS*

*Evento:* ${report.eventName}
*Data:* ${formatDate(report.eventDate)}
*Endereço:* ${report.eventAddress}
*Total de Participantes:* ${report.totalParticipants}
*Custo Total:* ${formatCurrency(report.totalEventCost)}

*ITENS DO EVENTO:*
${report.items
  .map(
    (item) =>
      `• ${item.itemName}: ${formatCurrency(item.totalCost)} (${formatCurrency(
        item.costPerPerson
      )} por pessoa) - ${item.isRequired ? "OBRIGATÓRIO" : "OPCIONAL"}`
  )
  .join("\n")}

*DIVISÃO POR PARTICIPANTE:*
${report.participants
  .map((participant) => {
    const itensTexto = participant.itemsResponsible
      .map((item) => {
        const itemInfo = report.items.find((i) => i.itemId === item.itemId);
        if (itemInfo && itemInfo.totalChosenBy > 0) {
          return `- ${item.itemName}: ${formatCurrency(
            item.individualCost
          )} (${formatCurrency(itemInfo.totalCost)} ÷ ${
            itemInfo.totalChosenBy
          } pessoas = ${formatCurrency(itemInfo.costPerPerson)})`;
        } else {
          return `- ${item.itemName}: ${formatCurrency(item.individualCost)}`;
        }
      })
      .join("\n");
    return `*${participant.name.trim()}* (${
      participant.phoneNumber
    })\nTotal: ${formatCurrency(participant.totalCost)}\n${itensTexto}`;
  })
  .join("\n\n")}

*Resumo:* Cada participante deve pagar o valor total dos itens que escolheu.`;

    // Copiar para clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Texto copiado!",
          text: "O relatório foi copiado para a área de transferência. Cole no WhatsApp!",
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(() => {
        // Fallback para navegadores que não suportam clipboard
        Swal.fire({
          icon: "info",
          title: "Texto do relatório",
          text: "Copie o texto abaixo:",
          html: `<textarea style="width: 100%; height: 300px; font-family: monospace; font-size: 12px;" readonly>${text}</textarea>`,
          confirmButtonText: "Fechar",
        });
      });
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

  if (!report) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 rounded-t-lg z-10 relative">
          {/* Botão fechar */}
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
                Relatório Completo
              </h2>
              <p className="text-sm text-gray-600 break-words mt-1">
                {report.eventName}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={generateExcel}
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
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar Excel
              </button>
              <button
                onClick={generateWhatsAppText}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Copiar para WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Resumo do Evento */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">
              Resumo do Evento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Nome:</span>
                <span className="ml-2 font-medium text-blue-900 break-words">
                  {report.eventName}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Data:</span>
                <span className="ml-2 font-medium text-blue-900">
                  {formatDate(report.eventDate)}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-blue-700">Endereço:</span>
                <span className="ml-2 font-medium text-blue-900 break-words">
                  {report.eventAddress}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Participantes:</span>
                <span className="ml-2 font-medium text-blue-900">
                  {report.totalParticipants}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Custo Total:</span>
                <span className="ml-2 font-medium text-blue-900 text-lg">
                  {formatCurrency(report.totalEventCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Itens do Evento */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Itens do Evento
            </h3>
            <div className="space-y-3">
              {report.items.map((item) => (
                <div
                  key={item.itemId}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex flex-col gap-3 mb-2">
                    <div className="flex items-start gap-2">
                      <h4 className="font-medium text-gray-900 break-words flex-1 min-w-0">
                        {item.itemName}
                      </h4>
                      {item.isRequired && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs flex-shrink-0">
                          OBRIGATÓRIO
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="text-sm text-gray-600">
                        <p>Participantes: {item.totalChosenBy}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(item.totalCost)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatCurrency(item.costPerPerson)} por pessoa
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divisão por Participante */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              Divisão por Participante
            </h3>
            <div className="space-y-4">
              {report.participants.map((participant) => (
                <div
                  key={participant.peopleId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col gap-3 mb-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 break-words flex-1">
                            {participant.name}
                          </h4>
                          {participant.isAdmin && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex-shrink-0">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 break-words">
                          {participant.phoneNumber}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(participant.totalCost)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {participant.totalItems} itens
                        </div>
                      </div>
                    </div>
                  </div>

                  {participant.itemsResponsible.length > 0 && (
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-700 mb-2">
                        Itens responsável:
                      </h5>
                      <div className="space-y-2">
                        {participant.itemsResponsible.map((item) => (
                          <div
                            key={item.itemId}
                            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1"
                          >
                            <span className="text-gray-600 break-words text-sm flex-1 min-w-0">
                              {item.itemName}
                            </span>
                            <span className="font-medium text-gray-900 text-sm flex-shrink-0">
                              {formatCurrency(item.individualCost)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Total Geral */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-green-900">
                Total Geral
              </span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(report.totalEventCost)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
