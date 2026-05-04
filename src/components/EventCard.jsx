// src/components/EventCard.jsx
import { Link } from 'react-router-dom';
import { HiLocationMarker, HiClock } from 'react-icons/hi';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';

// Category badge class mapping
export const catBadge = (cat) => ({
  Technology:       'badge-tech',
  Music:            'badge-music',
  'Food & Drink':   'badge-food',
  'Art & Culture':  'badge-art',
  Sports:           'badge-sports',
  Business:         'badge-biz',
  'Health & Wellness': 'badge-health',
}[cat] || 'badge-tech');

export default function EventCard({ event }) {
  const { isRegistered } = useApp();
  const reg  = isRegistered(event.id);
  const full = event.spots === 0;
  const low  = event.spots > 0 && event.spots <= 20;

  const dateObj = new Date(event.date + 'T12:00:00');
  const dateStr = format(dateObj, 'MMM d');
  const timeStr = format(new Date(`2000-01-01T${event.time}`), 'h:mm a');
  const locShort = event.location.split(',').slice(0, 2).join(',');

  return (
    <Link
      to={`/events/${event.id}`}
      className="card card-hover block group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${event.id + 10}/800/400`;
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Price badge */}
        <div
          className={`absolute top-3 right-3 px-2.5 py-1 rounded-sm text-xs font-bold font-mono border
            ${event.price === 0
              ? 'text-green-400 border-green-500/40 bg-black/80'
              : 'text-yellow-400 border-yellow-500/40 bg-black/80'
            }`}
        >
          {event.price === 0 ? 'FREE' : `$${event.price}`}
        </div>

        {/* Registered badge */}
        {reg && (
          <div className="absolute top-3 left-3 bg-green-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-widest">
            ✓ REGISTERED
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`badge ${catBadge(event.category)}`}>{event.category}</span>
          <span className={`badge ${event.type === 'Online' ? 'badge-online' : 'badge-inperson'}`}>
            {event.type}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl leading-tight mb-2 text-zinc-100">
          {event.title}
        </h3>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-zinc-400 mb-3">
          <HiLocationMarker className="shrink-0" />
          {locShort}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            <HiClock />
            {dateStr} · {timeStr}
          </span>
          <span
            className={`text-[11px] font-mono ${
              full ? 'text-zinc-500 line-through' : low ? 'text-red-400' : 'text-zinc-500'
            }`}
          >
            {full ? 'SOLD OUT' : low ? `⚠ ${event.spots} left` : `${event.spots} spots`}
          </span>
        </div>
      </div>
    </Link>
  );
}
