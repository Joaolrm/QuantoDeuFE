import Link from "next/link";
import { EventCutItensDTO } from "@/types/api";
import { formatDate } from "@/utils/date";

interface EventCardProps {
  event: EventCutItensDTO;
  onEventDeleted?: (deletedEventId: number) => void;
}

export function EventCard({ event, onEventDeleted }: EventCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20">
      <div className="mt-3">
        <Link
          href={`/main/events/${event.id}`}
          className="text-amber-300 hover:text-amber-400 text-sm font-medium block"
        >
          <h3 className="text-lg font-semibold text-white break-words mb-1">
            {event.name}
          </h3>
          <p className="text-gray-300 break-words">
            {formatDate(event.date)} • {event.address}
          </p>
        </Link>
      </div>
    </div>
  );
}
