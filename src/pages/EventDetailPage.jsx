// src/pages/EventDetailPage.jsx
// Uses: React Router v6 useParams, React-Leaflet for map
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { format } from 'date-fns';
import {
  HiArrowLeft, HiLocationMarker, HiClock,
  HiUserGroup, HiCalendar, HiGlobe,
} from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { catBadge } from '../components/EventCard';
import RegistrationModal from '../components/RegistrationModal';

export default function EventDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { events, isRegistered } = useApp();
  const [showModal, setShowModal] = useState(false);

  const event = events.find((e) => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-5xl mb-4">❌</p>
        <h2 className="font-display text-4xl text-zinc-400 mb-4">Event Not Found</h2>
        <Link to="/events" className="btn btn-secondary">← Back to Events</Link>
      </div>
    );
  }

  const reg    = isRegistered(event.id);
  const full   = event.spots === 0;
  const low    = event.spots > 0 && event.spots <= 20;
  const pct    = Math.round(((event.capacity - event.spots) / event.capacity) * 100);
  const dateStr = format(new Date(event.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy');
  const timeStr = format(new Date(`2000-01-01T${event.time}`), 'h:mm a');
  const endStr  = event.endTime
    ? format(new Date(`2000-01-01T${event.endTime}`), 'h:mm a')
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-zinc-400 hover:text-yellow-400 transition-colors text-sm mb-6"
      >
        <HiArrowLeft /> Back to Events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* ── LEFT COLUMN ──────────────────────────────────────────────────── */}
        <div>
          {/* Hero image */}
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-72 sm:h-80 object-cover rounded-xl border border-zinc-800"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${event.id + 50}/1200/600`;
            }}
          />

          {/* Badges + tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            <span className={`badge ${catBadge(event.category)}`}>{event.category}</span>
            <span className={`badge ${event.type === 'Online' ? 'badge-online' : 'badge-inperson'}`}>
              {event.type}
            </span>
            {event.tags.map((t) => (
              <span key={t} className="px-2.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded-sm text-[11px] text-zinc-400">
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-5xl sm:text-6xl mt-4 mb-4 leading-none">{event.title}</h1>

          {/* Meta info */}
          <div className="flex flex-wrap gap-5 mb-6">
            <div className="flex items-start gap-2 text-sm text-zinc-300">
              <HiCalendar className="mt-0.5 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Date</p>
                <p className="font-medium">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-zinc-300">
              <HiClock className="mt-0.5 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Time</p>
                <p className="font-medium">{timeStr}{endStr ? ` – ${endStr}` : ''}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-zinc-300">
              <HiLocationMarker className="mt-0.5 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Location</p>
                <p className="font-medium">{event.location.split(',')[0]}</p>
                <p className="text-zinc-500 text-xs">{event.location.split(',').slice(1).join(',').trim()}</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm text-zinc-300">
              <HiUserGroup className="mt-0.5 shrink-0 text-zinc-500" />
              <div>
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-0.5">Capacity</p>
                <p className="font-medium">{event.capacity} people</p>
                <p className={`text-xs ${low ? 'text-red-400' : 'text-zinc-500'}`}>
                  {full ? 'Sold out' : `${event.spots} spots remaining`}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-zinc-800 pt-5">
            <h2 className="font-display text-xl text-zinc-400 mb-3 tracking-wide">ABOUT THIS EVENT</h2>
            <div className="text-zinc-300 leading-relaxed space-y-3 text-[15px]">
              {event.description.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div className="border-t border-zinc-800 pt-5 mt-6">
            <h2 className="font-display text-xl text-zinc-400 mb-3 tracking-wide">ORGANIZER</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <p className="font-semibold text-zinc-100 mb-1">{event.organizer.name}</p>
              <p className="text-zinc-400 text-sm">{event.organizer.bio}</p>
            </div>
          </div>

          {/* Map (React-Leaflet) */}
          <div className="border-t border-zinc-800 pt-5 mt-6">
            <h2 className="font-display text-xl text-zinc-400 mb-3 tracking-wide">LOCATION</h2>
            {event.lat && event.lng ? (
              <div className="rounded-lg overflow-hidden border border-zinc-800 h-52">
                <MapContainer
                  center={[event.lat, event.lng]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[event.lat, event.lng]}>
                    <Popup>{event.title}<br />{event.location}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <HiGlobe className="text-2xl text-indigo-400 shrink-0" />
                <div>
                  <p className="text-zinc-100 font-medium">Virtual Event</p>
                  <p className="text-zinc-500 text-sm">{event.location}</p>
                </div>
              </div>
            )}
            <p className="text-xs text-zinc-600 mt-2">📍 {event.location}</p>
          </div>
        </div>

        {/* ── SIDEBAR ──────────────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-20 h-fit">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            {/* Price */}
            <p className={`font-mono text-3xl font-bold mb-4 ${event.price === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </p>

            {/* Capacity bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className={low ? 'text-red-400' : 'text-zinc-500'}>
                  {full ? 'SOLD OUT' : `${event.spots} of ${event.capacity} spots remaining`}
                </span>
                <span className="text-zinc-600 font-mono">{pct}%</span>
              </div>
              <div className="h-1 bg-zinc-800 rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ${low && !full ? 'bg-red-500' : 'bg-yellow-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* CTA Button */}
            {reg ? (
              <button disabled className="btn btn-lg w-full justify-center text-green-400 border border-green-500 bg-transparent opacity-100">
                ✓ You're Registered
              </button>
            ) : full ? (
              <button disabled className="btn btn-lg w-full justify-center bg-zinc-800 text-zinc-500 border border-zinc-700">
                Event Full
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg w-full justify-center"
                onClick={() => setShowModal(true)}
              >
                Register Now →
              </button>
            )}

            {/* Details list */}
            <div className="mt-5 space-y-0">
              {[
                ['Date',     dateStr],
                ['Time',     `${timeStr}${endStr ? ` – ${endStr}` : ''}`],
                ['Type',     event.type],
                ['Capacity', `${event.capacity} attendees`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2.5 border-b border-zinc-800 text-sm">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest">{label}</span>
                  <span className="text-zinc-200 font-medium text-right max-w-[60%]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Registration modal */}
      {showModal && (
        <RegistrationModal event={event} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
