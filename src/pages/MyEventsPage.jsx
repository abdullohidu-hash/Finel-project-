// src/pages/MyEventsPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isPast } from 'date-fns';
import {
  HiTicket, HiLocationMarker, HiClock, HiTrash, HiCalendar,
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { catBadge } from '../components/EventCard';

export default function MyEventsPage() {
  const { events, regs, cancelRegistration } = useApp();
  const [tab, setTab] = useState('upcoming');
  const [confirmId, setConfirmId] = useState(null);

  // Get registered events with their data
  const registeredEvents = regs
    .map((r) => {
      const event = events.find((e) => e.id === r.eventId);
      return event ? { ...event, regInfo: r } : null;
    })
    .filter(Boolean);

  const now = new Date();
  const upcoming = registeredEvents.filter(
    (e) => !isPast(new Date(e.date + 'T23:59:59'))
  );
  const past = registeredEvents.filter(
    (e) => isPast(new Date(e.date + 'T23:59:59'))
  );

  const displayed = tab === 'upcoming' ? upcoming : past;

  const handleCancel = (eventId) => {
    cancelRegistration(eventId);
    setConfirmId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl sm:text-6xl text-zinc-100 leading-none mb-1">
          MY <span className="text-yellow-400">EVENTS</span>
        </h1>
        <p className="text-zinc-500 text-sm">
          {regs.length} registration{regs.length !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-800 pb-0">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { key: 'past',     label: 'Past',     count: past.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors
              ${tab === key
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-200'
              }`}
          >
            {label}
            {count > 0 && (
              <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                ${tab === key ? 'bg-yellow-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Event list */}
      {displayed.length === 0 ? (
        <div className="text-center py-20">
          <HiTicket className="text-6xl text-zinc-700 mx-auto mb-4" />
          <h3 className="font-display text-3xl text-zinc-600 mb-2">
            {tab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events'}
          </h3>
          <p className="text-zinc-600 text-sm mb-6">
            {tab === 'upcoming'
              ? "You haven't registered for any upcoming events yet."
              : "Events you've attended will appear here."}
          </p>
          {tab === 'upcoming' && (
            <Link to="/events" className="btn btn-primary">
              Browse Events →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map((event) => {
            const dateStr = format(new Date(event.date + 'T12:00:00'), 'EEE, MMM d, yyyy');
            const timeStr = format(new Date(`2000-01-01T${event.time}`), 'h:mm a');
            const isUpcoming = tab === 'upcoming';

            return (
              <div
                key={event.id}
                className={`bg-zinc-900 border rounded-xl overflow-hidden transition-all
                  ${isUpcoming ? 'border-zinc-700' : 'border-zinc-800 opacity-70'}`}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <Link to={`/events/${event.id}`} className="shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full sm:w-36 h-32 sm:h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${event.id + 10}/400/200`;
                      }}
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                    <div>
                      {/* Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <span className={`badge ${catBadge(event.category)}`}>{event.category}</span>
                        <span className={`badge ${event.type === 'Online' ? 'badge-online' : 'badge-inperson'}`}>
                          {event.type}
                        </span>
                        {!isUpcoming && (
                          <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-500 text-[10px] rounded-sm font-medium tracking-wider">
                            PAST
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link
                        to={`/events/${event.id}`}
                        className="font-display text-xl text-zinc-100 hover:text-yellow-400 transition-colors leading-tight block mb-2"
                      >
                        {event.title}
                      </Link>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <HiCalendar className="text-zinc-600" /> {dateStr}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HiClock className="text-zinc-600" /> {timeStr}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HiLocationMarker className="text-zinc-600" />
                          {event.location.split(',').slice(0, 2).join(',')}
                        </span>
                      </div>

                      {/* Registration info */}
                      <div className="mt-2 text-[11px] text-zinc-600">
                        Registered as <span className="text-zinc-400">{event.regInfo.name}</span>
                        {' · '}<span className="text-zinc-400">{event.regInfo.email}</span>
                      </div>
                    </div>

                    {/* Footer: price + cancel */}
                    <div className="flex items-center justify-between">
                      <span className={`font-mono text-sm font-bold ${event.price === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {event.price === 0 ? 'FREE' : `$${event.price}`}
                      </span>

                      {isUpcoming && (
                        <>
                          {confirmId === event.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-400">Cancel registration?</span>
                              <button
                                onClick={() => handleCancel(event.id)}
                                className="btn btn-danger btn-sm"
                              >
                                Yes, Cancel
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="btn btn-secondary btn-sm"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmId(event.id)}
                              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                            >
                              <HiTrash /> Cancel Registration
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
