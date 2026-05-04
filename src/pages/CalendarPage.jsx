// src/pages/CalendarPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday,
} from 'date-fns';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { catBadge } from '../components/EventCard';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { events } = useApp();
  const navigate   = useNavigate();
  const [current, setCurrent] = useState(new Date());

  // Build calendar grid
  const monthStart = startOfMonth(current);
  const monthEnd   = endOfMonth(current);
  const gridStart  = startOfWeek(monthStart);
  const gridEnd    = endOfWeek(monthEnd);

  const days = [];
  let d = gridStart;
  while (d <= gridEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  // Get events for a given day
  const eventsOnDay = (day) =>
    events.filter((e) => isSameDay(new Date(e.date + 'T12:00:00'), day));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl text-zinc-100 leading-none">
            {format(current, 'MMMM').toUpperCase()}{' '}
            <span className="text-yellow-400">{format(current, 'yyyy')}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">{events.length} events this platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent(subMonths(current, 1))}
            className="btn btn-secondary p-2"
            aria-label="Previous month"
          >
            <HiChevronLeft className="text-xl" />
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="btn btn-secondary px-4 py-2 text-xs"
          >
            Today
          </button>
          <button
            onClick={() => setCurrent(addMonths(current, 1))}
            className="btn btn-secondary p-2"
            aria-label="Next month"
          >
            <HiChevronRight className="text-xl" />
          </button>
        </div>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600 py-2"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-l border-t border-zinc-800">
        {days.map((day, idx) => {
          const dayEvents = eventsOnDay(day);
          const inMonth   = isSameMonth(day, current);
          const todayDay  = isToday(day);

          return (
            <div
              key={idx}
              className={`min-h-[100px] border-r border-b border-zinc-800 p-1.5 transition-colors
                ${inMonth ? 'bg-zinc-950' : 'bg-zinc-950/40'}
              `}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className={`text-xs font-mono w-6 h-6 flex items-center justify-center rounded-full
                    ${todayDay
                      ? 'bg-yellow-400 text-zinc-950 font-bold'
                      : inMonth
                        ? 'text-zinc-400'
                        : 'text-zinc-700'
                    }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              {/* Events on this day */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => navigate(`/events/${ev.id}`)}
                    className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate
                      transition-all hover:brightness-125 leading-snug
                      ${catBadge(ev.category) === 'badge-tech'    ? 'bg-blue-900/70  text-blue-300'   :
                        catBadge(ev.category) === 'badge-music'   ? 'bg-purple-900/70 text-purple-300' :
                        catBadge(ev.category) === 'badge-food'    ? 'bg-orange-900/70 text-orange-300' :
                        catBadge(ev.category) === 'badge-art'     ? 'bg-pink-900/70  text-pink-300'   :
                        catBadge(ev.category) === 'badge-sports'  ? 'bg-green-900/70 text-green-300'  :
                        catBadge(ev.category) === 'badge-biz'     ? 'bg-yellow-900/70 text-yellow-300':
                        catBadge(ev.category) === 'badge-health'  ? 'bg-teal-900/70  text-teal-300'   :
                        'bg-zinc-800 text-zinc-300'
                      }
                    `}
                    title={ev.title}
                  >
                    {ev.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-[9px] text-zinc-600 pl-1">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        {[
          { label: 'Technology',      cls: 'bg-blue-900/70  text-blue-300'   },
          { label: 'Music',           cls: 'bg-purple-900/70 text-purple-300' },
          { label: 'Food & Drink',    cls: 'bg-orange-900/70 text-orange-300' },
          { label: 'Art & Culture',   cls: 'bg-pink-900/70  text-pink-300'   },
          { label: 'Sports',          cls: 'bg-green-900/70 text-green-300'  },
          { label: 'Business',        cls: 'bg-yellow-900/70 text-yellow-300' },
          { label: 'Health & Wellness', cls: 'bg-teal-900/70 text-teal-300'  },
        ].map(({ label, cls }) => (
          <span key={label} className={`px-2 py-0.5 rounded text-[10px] font-medium ${cls}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
