// src/utils/storage.js — LocalStorage helpers

import { INITIAL_EVENTS } from '../data/events';

const EVENTS_KEY = 'evntly_events';
const REGS_KEY   = 'evntly_regs';

// ── Events ────────────────────────────────────────────────────────────────────
export const getStoredEvents = () => {
  try {
    const stored = localStorage.getItem(EVENTS_KEY);
    return stored ? JSON.parse(stored) : INITIAL_EVENTS;
  } catch {
    return INITIAL_EVENTS;
  }
};

export const saveEvents = (events) => {
  try {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save events:', e);
  }
};

// ── Registrations ─────────────────────────────────────────────────────────────
export const getStoredRegs = () => {
  try {
    const stored = localStorage.getItem(REGS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveRegs = (regs) => {
  try {
    localStorage.setItem(REGS_KEY, JSON.stringify(regs));
  } catch (e) {
    console.error('Failed to save registrations:', e);
  }
};
