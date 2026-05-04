// src/components/RegistrationModal.jsx
import { useState } from 'react';
import { HiX, HiCheckCircle } from 'react-icons/hi';
import { format } from 'date-fns';
import { useApp } from '../context/AppContext';

export default function RegistrationModal({ event, onClose }) {
  const { registerForEvent } = useApp();
  const [form, setForm]   = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = 'Full name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email address required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    registerForEvent(event.id, form);
    setSuccess(true);
  };

  const dateStr = format(new Date(event.date + 'T12:00:00'), 'EEE, MMM d, yyyy');
  const timeStr = format(new Date(`2000-01-01T${event.time}`), 'h:mm a');

  return (
    <div
      className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-[slideUp_0.2s_ease]">
        {!success ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1.5">Register for</p>
                <h2 className="font-display text-2xl">{event.title}</h2>
              </div>
              <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 p-1 transition-colors">
                <HiX className="text-xl" />
              </button>
            </div>

            {/* Event summary */}
            <div className="flex gap-4 p-3.5 bg-zinc-800 rounded border border-zinc-700 mb-6">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Date & Time</p>
                <p className="text-sm text-zinc-200">{dateStr} · {timeStr}</p>
              </div>
              <div className="w-px bg-zinc-700" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Price</p>
                <p className={`text-sm font-mono font-bold ${event.price === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {event.price === 0 ? 'FREE' : `$${event.price}`}
                </p>
              </div>
              <div className="w-px bg-zinc-700" />
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">Spots Left</p>
                <p className={`text-sm font-mono font-bold ${event.spots <= 20 ? 'text-red-400' : 'text-zinc-200'}`}>
                  {event.spots}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Full Name *
                </label>
                <input
                  className="input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Email Address *
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                  Phone Number *
                </label>
                <input
                  className="input"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full justify-center">
                {event.price === 0 ? 'Register for Free →' : `Register — $${event.price} →`}
              </button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center py-6">
            <HiCheckCircle className="text-6xl text-green-400 mx-auto mb-4" />
            <h2 className="font-display text-4xl text-green-400 mb-3">REGISTERED!</h2>
            <p className="text-zinc-300 mb-1">
              You're confirmed for <strong>{event.title}</strong>
            </p>
            <p className="text-zinc-500 text-sm">
              {dateStr} at {timeStr}
            </p>
            <button className="btn btn-primary mt-8" onClick={onClose}>
              Done ✓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
