import { UserResponse } from "@/types/api";

const API_BASE_URL = "https://quantodeu-862319110846.southamerica-east1.run.app";

export const getUserEvents = async (
  phoneNumber: string
): Promise<UserResponse> => {
  try {
    // Remove qualquer caractere não numérico e o prefixo do país se existir
    const cleanedNumber = phoneNumber.replace(/\D/g, "").replace(/^55/, "");

    // Formata como 51-991984252 (assumindo que o número já está no formato correto)
    const formattedNumber =
      cleanedNumber.length > 2
        ? `${cleanedNumber.substring(0, 2)}-${cleanedNumber.substring(2)}`
        : cleanedNumber;

    const response = await fetch(
      `${API_BASE_URL}/api/Peoples/${formattedNumber}/Events`,
      {
        method: "GET",
        headers: {
          accept: "text/plain",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar eventos do usuário:", error);
    throw error;
  }
};
