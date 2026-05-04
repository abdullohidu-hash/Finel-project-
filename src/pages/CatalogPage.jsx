// src/pages/CatalogPage.jsx
import { useState, useMemo } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';
import {
  isWithinInterval, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, addMonths,
} from 'date-fns';
import { useApp } from '../context/AppContext';
import EventCard from '../components/EventCard';
import { CATEGORIES, DATE_OPTIONS, PRICE_OPTIONS, TYPE_OPTIONS } from '../data/events';

export default function CatalogPage() {
  const { events } = useApp();
  const [query,  setQuery]  = useState('');
  const [cat,    setCat]    = useState('All');
  const [dateR,  setDateR]  = useState('All Dates');
  const [priceF, setPriceF] = useState('Any Price');
  const [typeF,  setTypeF]  = useState('All Types');

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const now = new Date();
    return events.filter((e) => {
      // Search
      if (
        query &&
        !e.title.toLowerCase().includes(query.toLowerCase()) &&
        !e.organizer.name.toLowerCase().includes(query.toLowerCase())
      ) return false;

      // Category
      if (cat !== 'All' && e.category !== cat) return false;

      // Date range
      const d = new Date(e.date + 'T12:00:00');
      if (dateR === 'This Week') {
        if (!isWithinInterval(d, { start: startOfWeek(now), end: endOfWeek(now) })) return false;
      }
      if (dateR === 'This Month') {
        if (!isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) })) return false;
      }
      if (dateR === 'Next Month') {
        const next = addMonths(now, 1);
        if (!isWithinInterval(d, { start: startOfMonth(next), end: endOfMonth(next) })) return false;
      }

      // Price
      if (priceF === 'Free' && e.price !== 0) return false;
      if (priceF === 'Paid' && e.price === 0) return false;

      // Type
      if (typeF !== 'All Types' && e.type !== typeF) return false;

      return true;
    });
  }, [events, query, cat, dateR, priceF, typeF]);

  const hasFilters = cat !== 'All' || dateR !== 'All Dates' || priceF !== 'Any Price' || typeF !== 'All Types';
  const clearAll   = () => { setCat('All'); setDateR('All Dates'); setPriceF('Any Price'); setTypeF('All Types'); };

  // Reusable filter select
  const FilterSelect = ({ value, onChange, options }) => (
    <div className="relative">
      <select
        className={`appearance-none bg-zinc-900 border text-sm font-medium pl-3 pr-7 py-2 rounded outline-none transition-colors cursor-pointer
          ${value !== options[0]
            ? 'border-yellow-500/60 text-yellow-400'
            : 'border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
          }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[9px]">▾</span>
    </div>
  );

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 bg-zinc-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-6xl sm:text-7xl text-zinc-100 mb-1">
            DISCOVER <span className="text-yellow-400">EVENTS</span>
          </h1>
          <p className="text-zinc-400 text-base mb-7">Find and attend experiences that matter to you</p>

          {/* Search bar */}
          <div className="relative max-w-lg">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-lg" />
            <input
              type="text"
              placeholder="Search events or organizers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-yellow-400 text-zinc-100 placeholder-zinc-600 pl-11 pr-10 py-3 rounded text-sm outline-none transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-100 transition-colors"
              >
                <HiX />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4 items-center">
            <FilterSelect value={cat}    onChange={setCat}    options={CATEGORIES}    />
            <FilterSelect value={dateR}  onChange={setDateR}  options={DATE_OPTIONS}  />
            <FilterSelect value={priceF} onChange={setPriceF} options={PRICE_OPTIONS} />
            <FilterSelect value={typeF}  onChange={setTypeF}  options={TYPE_OPTIONS}  />
            {hasFilters && (
              <button className="btn btn-sm btn-secondary" onClick={clearAll}>
                <HiX /> Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Event Grid ───────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <p className="text-xs text-zinc-500 font-mono mb-5">
          Showing <span className="text-yellow-400">{filtered.length}</span> event
          {filtered.length !== 1 ? 's' : ''}
          {query ? ` for "${query}"` : ''}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-5xl mb-4 opacity-20">🔎</p>
            <h3 className="font-display text-3xl text-zinc-500 mb-2">No Events Found</h3>
            <p className="text-zinc-600 text-sm mb-6">Try adjusting your search or filters.</p>
            <button className="btn btn-secondary" onClick={() => { setQuery(''); clearAll(); }}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
