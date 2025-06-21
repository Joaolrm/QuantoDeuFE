import { useShare } from "@/hooks/useShare";
import Swal from "sweetalert2";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  children?: React.ReactNode;
}

export function ShareButton({
  title,
  text,
  url,
  className = "",
  children,
}: ShareButtonProps) {
  const { share, isSupported, isSharing } = useShare();

  const handleShare = async () => {
    try {
      await share({ title, text, url });

      const message = isSupported
        ? "Conteúdo compartilhado com sucesso!"
        : "Link copiado para a área de transferência.";

      await Swal.fire({
        icon: "success",
        title: isSupported ? "Compartilhado!" : "Link copiado!",
        text: message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error sharing:", error);

      await Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Não foi possível compartilhar. Tente novamente.",
      });
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={`text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 disabled:opacity-50 ${className}`}
      title="Compartilhar evento"
    >
      {children || (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        </svg>
      )}
    </button>
  );
}
