// src/components/Navbar.jsx
import { NavLink, Link } from 'react-router-dom';
import { HiCalendar, HiTicket, HiPlus, HiCollection } from 'react-icons/hi';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { regs } = useApp();

  const links = [
    { to: '/events',       label: 'Events',     Icon: HiCollection },
    { to: '/calendar',     label: 'Calendar',   Icon: HiCalendar },
    { to: '/my-events',    label: 'My Events',  Icon: HiTicket,  badge: regs.length },
    { to: '/create-event', label: '+ Create',   Icon: HiPlus },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-2">
        {/* Logo */}
        <Link
          to="/events"
          className="font-display text-2xl text-yellow-400 tracking-widest mr-4 shrink-0"
          style={{ textShadow: '0 0 20px rgba(250,204,21,0.3)' }}
        >
          EVNTLY
        </Link>

        {/* Nav links */}
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {links.map(({ to, label, Icon, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-all whitespace-nowrap border
                 ${isActive
                   ? 'text-yellow-400 border-zinc-700 bg-zinc-900'
                   : 'text-zinc-400 border-transparent hover:text-zinc-100 hover:bg-zinc-900'
                 }`
              }
            >
              <Icon className="text-base" />
              {label}
              {badge > 0 && (
                <span className="bg-yellow-400 text-zinc-950 text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none ml-0.5">
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
