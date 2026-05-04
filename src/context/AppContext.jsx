// src/context/AppContext.jsx
// Global state: events + registrations, persisted to LocalStorage

import { createContext, useContext, useState, useEffect } from 'react';
import { getStoredEvents, saveEvents, getStoredRegs, saveRegs } from '../utils/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [events, setEvents]   = useState(() => getStoredEvents());
  const [regs,   setRegs]     = useState(() => getStoredRegs());

  // Persist to LocalStorage whenever state changes
  useEffect(() => { saveEvents(events); }, [events]);
  useEffect(() => { saveRegs(regs);     }, [regs]);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const registerForEvent = (eventId, formData) => {
    setRegs((prev) => [
      ...prev,
      { eventId, ...formData, registeredAt: new Date().toISOString() },
    ]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId ? { ...e, spots: Math.max(0, e.spots - 1) } : e
      )
    );
  };

  const cancelRegistration = (eventId) => {
    setRegs((prev) => prev.filter((r) => r.eventId !== eventId));
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, spots: e.spots + 1 } : e))
    );
  };

  const createEvent = (newEvent) => {
    const id = Date.now();
    setEvents((prev) => [{ ...newEvent, id }, ...prev]);
    return id;
  };

  const isRegistered = (eventId) => regs.some((r) => r.eventId === eventId);

  return (
    <AppContext.Provider
      value={{ events, regs, registerForEvent, cancelRegistration, createEvent, isRegistered }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
