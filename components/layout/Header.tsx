'use client';

import React from 'react';
import { useAppStore, UserRole } from '@/lib/store';
import {
  ShieldCheck,
  UserCheck,
  Heart,
  Globe,
  Settings,
  Plus,
  LogOut,
  User,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    language,
    setLanguage,
    daycareSettings,
    openSettingsModal,
    openProfileModal,
    currentUser,
    logout,
    parents,
    selectedParentId,
    setSelectedParentId,
    staff,
    selectedStaffId,
    setSelectedStaffId,
    t,
  } = useAppStore();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-nursery-sand shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Daycare Branding */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-nursery-orange to-nursery-coral text-white flex items-center justify-center font-black text-2xl shadow-md shadow-nursery-orange/20 ring-2 ring-white">
            {daycareSettings.logo || '🎈'}
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight">
              {daycareSettings.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {daycareSettings.subtitle}
            </p>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active User Badge & Session Info */}
          {currentUser && (
            <button
              onClick={openProfileModal}
              title="Modifier Mon Profil, Login & Mot de passe"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-6 h-6 rounded-full object-cover ring-2 ring-indigo-400" />
              ) : (
                <User className="w-4 h-4 text-slate-500" />
              )}
              <span>{currentUser.role === 'admin' ? (daycareSettings.directorName || currentUser.name) : currentUser.name}</span>
              <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">⚙️ Profil</span>
            </button>
          )}

          {/* Locked Role Badge */}
          {currentUser?.role === 'admin' ? (
            <div className="bg-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-nursery-orange" />
              <span>Administration</span>
            </div>
          ) : (
            <div className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
              {(role === 'educator' || role === 'staff') ? (
                <UserCheck className="w-3.5 h-3.5 text-nursery-mint" />
              ) : (
                <Heart className="w-3.5 h-3.5 text-nursery-purple" />
              )}
              <span>{(role === 'educator' || role === 'staff') ? 'Session Éducatrice' : 'Session Parent'}</span>
            </div>
          )}

          {/* Session is locked to the logged-in user — no session switching allowed */}

          {/* Admin Settings Trigger */}
          {role === 'admin' && (
            <button
              onClick={openSettingsModal}
              title="Configuration de la garderie"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}

          {/* Language Switcher */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-2xl px-2.5 py-2 focus:outline-none cursor-pointer"
          >
            <option value="fr">🇫🇷 FR</option>
            <option value="ar">🇸🇦 AR</option>
            <option value="en">🇬🇧 EN</option>
          </select>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Se déconnecter"
            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all font-bold text-xs flex items-center gap-1"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};
