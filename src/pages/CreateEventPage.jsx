// src/pages/CreateEventPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle } from 'react-icons/hi';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/events';

const TYPES      = ['In-Person', 'Online', 'Hybrid'];
const CATEGORIES_NO_ALL = CATEGORIES.filter((c) => c !== 'All');

const EMPTY = {
  title:       '',
  description: '',
  category:    CATEGORIES_NO_ALL[0],
  type:        'In-Person',
  date:        '',
  time:        '',
  endTime:     '',
  location:    '',
  lat:         '',
  lng:         '',
  capacity:    '',
  price:       '',
  image:       '',
  organizer:   '',
  orgBio:      '',
  tags:        '',
};

export default function CreateEventPage() {
  const { createEvent } = useApp();
  const navigate        = useNavigate();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [newId, setNewId]     = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim())        e.title       = 'Title is required';
    if (!form.description.trim())  e.description = 'Description is required';
    if (!form.date)                e.date        = 'Date is required';
    if (!form.time)                e.time        = 'Start time is required';
    if (!form.location.trim())     e.location    = 'Location is required';
    if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) < 1)
                                   e.capacity    = 'Valid capacity is required';
    if (form.price !== '' && isNaN(Number(form.price)))
                                   e.price       = 'Price must be a number';
    if (!form.organizer.trim())    e.organizer   = 'Organizer name is required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    const id = createEvent({
      title:       form.title.trim(),
      description: form.description.trim(),
      category:    form.category,
      type:        form.type,
      date:        form.date,
      time:        form.time,
      endTime:     form.endTime || null,
      location:    form.location.trim(),
      lat:         form.lat ? parseFloat(form.lat) : null,
      lng:         form.lng ? parseFloat(form.lng) : null,
      capacity:    parseInt(form.capacity),
      spots:       parseInt(form.capacity),
      price:       form.price === '' ? 0 : parseFloat(form.price),
      image:       form.image.trim() ||
                   `https://picsum.photos/seed/${Date.now()}/800/400`,
      organizer:   { name: form.organizer.trim(), bio: form.orgBio.trim() },
      tags:        form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setNewId(id);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shared field components
  const Field = ({ label, error, required, children }) => (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
        {label} {required && <span className="text-yellow-500">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <HiCheckCircle className="text-7xl text-green-400 mx-auto mb-5" />
        <h2 className="font-display text-5xl text-green-400 mb-3">EVENT CREATED!</h2>
        <p className="text-zinc-300 mb-6">
          Your event is now live in the catalog.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(`/events/${newId}`)}
            className="btn btn-primary"
          >
            View Event →
          </button>
          <button
            onClick={() => { setForm(EMPTY); setErrors({}); setSuccess(false); }}
            className="btn btn-secondary"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-5xl sm:text-6xl text-zinc-100 leading-none mb-1">
          CREATE <span className="text-yellow-400">EVENT</span>
        </h1>
        <p className="text-zinc-500 text-sm">Fill in the details to publish your event to the catalog.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic Info ─────────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">BASIC INFORMATION</h2>

          <Field label="Event Title" required error={errors.title}>
            <input
              className="input"
              placeholder="e.g. JavaScript Workshop 2025"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>

          <Field label="Description" required error={errors.description}>
            <textarea
              className="textarea"
              rows={4}
              placeholder="Describe what attendees can expect…"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <select
                className="select"
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
              >
                {CATEGORIES_NO_ALL.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Event Type" required>
              <select
                className="select"
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Tags (comma separated)">
            <input
              className="input"
              placeholder="e.g. beginner, networking, free food"
              value={form.tags}
              onChange={(e) => set('tags', e.target.value)}
            />
          </Field>
        </div>

        {/* ── Date & Time ────────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">DATE & TIME</h2>

          <Field label="Date" required error={errors.date}>
            <input
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => set('date', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Time" required error={errors.time}>
              <input
                type="time"
                className="input"
                value={form.time}
                onChange={(e) => set('time', e.target.value)}
              />
            </Field>
            <Field label="End Time (optional)">
              <input
                type="time"
                className="input"
                value={form.endTime}
                onChange={(e) => set('endTime', e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* ── Location ───────────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">LOCATION</h2>

          <Field label="Address / Location" required error={errors.location}>
            <input
              className="input"
              placeholder="e.g. 123 Main St, San Francisco, CA"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude (optional)">
              <input
                type="number"
                step="any"
                className="input"
                placeholder="37.7749"
                value={form.lat}
                onChange={(e) => set('lat', e.target.value)}
              />
            </Field>
            <Field label="Longitude (optional)">
              <input
                type="number"
                step="any"
                className="input"
                placeholder="-122.4194"
                value={form.lng}
                onChange={(e) => set('lng', e.target.value)}
              />
            </Field>
          </div>
          <p className="text-[11px] text-zinc-600">
            Coordinates enable the map on the event detail page. Leave blank for online events.
          </p>
        </div>

        {/* ── Tickets & Pricing ──────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">TICKETS & PRICING</h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Capacity" required error={errors.capacity}>
              <input
                type="number"
                min="1"
                className="input"
                placeholder="100"
                value={form.capacity}
                onChange={(e) => set('capacity', e.target.value)}
              />
            </Field>
            <Field label="Price (USD)" error={errors.price}>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input"
                placeholder="0 for free"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* ── Media ──────────────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">MEDIA</h2>

          <Field label="Image URL (optional)">
            <input
              className="input"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={(e) => set('image', e.target.value)}
            />
          </Field>
          <p className="text-[11px] text-zinc-600">
            Leave blank to use a random placeholder image.
          </p>
        </div>

        {/* ── Organizer ──────────────────────────────────────────────────────── */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg text-zinc-400 tracking-widest">ORGANIZER</h2>

          <Field label="Organizer Name" required error={errors.organizer}>
            <input
              className="input"
              placeholder="Your name or organization"
              value={form.organizer}
              onChange={(e) => set('organizer', e.target.value)}
            />
          </Field>

          <Field label="Organizer Bio (optional)">
            <textarea
              className="textarea"
              rows={2}
              placeholder="Brief description of the organizer…"
              value={form.orgBio}
              onChange={(e) => set('orgBio', e.target.value)}
            />
          </Field>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
          Publish Event →
        </button>
      </form>
    </div>
  );
}
