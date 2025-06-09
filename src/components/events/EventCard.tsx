import Link from "next/link";
import { EventCutItensDTO } from "@/lib/api";
import { formatDate } from "@/utils/date";

interface EventCardProps {
  event: EventCutItensDTO;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20">
      <h3 className="text-lg font-semibold text-white">{event.name}</h3>
      <p className="text-gray-300">
        {formatDate(event.date)} • {event.address}
      </p>

      <div className="mt-3 flex justify-between">
        <Link
          href={`/main/events/${event.id}`}
          className="text-amber-300 hover:text-amber-400 text-sm font-medium"
        >
          Ver detalhes
        </Link>

        <Link
          href={`/main/events/${event.id}/manage`}
          className="text-rose-500 hover:text-green-600 text-sm font-medium"
        >
          Gerenciar
        </Link>
      </div>
    </div>
  );
}
