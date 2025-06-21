import { useState } from "react";

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface UseShareReturn {
  share: (data: ShareData) => Promise<void>;
  isSupported: boolean;
  isSharing: boolean;
}

export function useShare(): UseShareReturn {
  const [isSharing, setIsSharing] = useState(false);

  const isSupported = typeof navigator !== "undefined" && "share" in navigator;

  const share = async (data: ShareData): Promise<void> => {
    setIsSharing(true);

    try {
      if (isSupported) {
        await navigator.share(data);
      } else {
        // Fallback para dispositivos que não suportam Web Share API
        await navigator.clipboard.writeText(data.url);
      }
    } catch (error) {
      console.error("Error sharing:", error);

      // Se o usuário cancelou o compartilhamento, não rejeita a promise
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      // Fallback em caso de erro
      if (isSupported) {
        await navigator.clipboard.writeText(data.url);
      } else {
        throw error;
      }
    } finally {
      setIsSharing(false);
    }
  };

  return {
    share,
    isSupported,
    isSharing,
  };
}
