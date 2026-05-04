// src/App.jsx — React Router v6 setup
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import CatalogPage     from './pages/CatalogPage';
import EventDetailPage from './pages/EventDetailPage';
import CalendarPage    from './pages/CalendarPage';
import MyEventsPage    from './pages/MyEventsPage';
import CreateEventPage from './pages/CreateEventPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"              element={<Navigate to="/events" replace />} />
              <Route path="/events"        element={<CatalogPage />} />
              <Route path="/events/:id"    element={<EventDetailPage />} />
              <Route path="/calendar"      element={<CalendarPage />} />
              <Route path="/my-events"     element={<MyEventsPage />} />
              <Route path="/create-event"  element={<CreateEventPage />} />
              <Route path="*"              element={<Navigate to="/events" replace />} />
            </Routes>
          </main>
          <footer className="border-t border-zinc-800 py-6 text-center text-zinc-600 text-xs font-mono mt-16">
            EVNTLY — <span className="text-yellow-400">Event Management Platform</span> · IDU Frontend Final Project 10 · React + Vite
          </footer>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
