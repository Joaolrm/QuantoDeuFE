import Link from "next/link";
import { EventWithAdminDTO } from "@/types/api";
import { formatDate } from "@/utils/date";

interface EventCardProps {
  event: EventWithAdminDTO;
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
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-white break-words flex-1">
              {event.name}
            </h3>
            {event.isAdmin && (
              <span className="ml-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full flex-shrink-0">
                Admin
              </span>
            )}
          </div>
          <p className="text-gray-300 break-words">
            {formatDate(event.date)} • {event.address}
          </p>
        </Link>
      </div>
    </div>
  );
}
