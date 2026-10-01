'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  LayoutDashboard,
  Baby,
  CalendarCheck2,
  Receipt,
  BookOpenText,
  Megaphone,
  UserCheck,
  Heart,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    role,
    currentUser,
    staff,
    activeTab,
    setActiveTab,
    openAddChildModal,
    openAddParentModal,
    openAddStaffModal,
    openAddSectionModal,
    openSettingsModal,
    logout,
    t,
  } = useAppStore();

  const labels = t();

  const isEducator = role === 'educator' || role === 'staff';
  const currentStaff = isEducator ? staff.find((s) => s.id === currentUser?.id) : null;

  // Navigation Items per Role
  const navItems = [
    {
      id: 'dashboard',
      label: labels.navDashboard,
      icon: LayoutDashboard,
      roles: ['admin'],
      color: 'text-nursery-orange',
    },
    {
      id: 'children',
      label: labels.navChildren,
      icon: Baby,
      roles: ['admin', 'educator', 'staff'],
      color: 'text-nursery-purple',
    },
    {
      id: 'parents',
      label: 'Parents & Familles',
      icon: Users,
      roles: ['admin'],
      color: 'text-nursery-sky-dark',
    },
    {
      id: 'attendance',
      label: labels.navAttendance,
      icon: CalendarCheck2,
      roles: ['admin', 'educator', 'staff'],
      color: 'text-nursery-mint-dark',
    },
    {
      id: 'billing',
      label: labels.navBilling,
      icon: Receipt,
      roles: ['admin'],
      color: 'text-nursery-coral',
    },
    {
      id: 'journal',
      label: labels.navJournal,
      icon: BookOpenText,
      roles: ['admin', 'educator', 'staff'],
      color: 'text-nursery-purple-dark',
    },
    {
      id: 'announcements',
      label: labels.navAnnouncements,
      icon: Megaphone,
      roles: ['admin', 'educator', 'staff', 'parent'],
      color: 'text-nursery-sky-dark',
    },
    {
      id: 'staff',
      label: labels.navStaff,
      icon: UserCheck,
      roles: ['admin', 'educator', 'staff'],
      color: 'text-teal-700',
    },
    {
      id: 'parentPortal',
      label: labels.navParentPortal,
      icon: Heart,
      roles: ['admin', 'parent'],
      color: 'text-rose-600',
    },
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-full lg:w-64 bg-white/70 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-nursery-sand p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-4">
        {/* Session Role Indicator Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Session Active
          </span>
          <p className="font-extrabold text-slate-900 text-sm mt-0.5 capitalize flex items-center justify-between">
            <span>
              {role === 'admin' ? '👑 Administration' : isEducator ? `👩‍🏫 ${currentUser?.name || 'Éducatrice'}` : '👨‍👩‍👧 Espace Parent'}
            </span>
          </p>
          {isEducator && (
            <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              🔒 Classe: {currentStaff?.assignedSectionName || 'Petite Section'}
            </span>
          )}
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10 scale-[1.02]'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-nursery-orange' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Admin Management Quick Creator Actions */}
      {role === 'admin' ? (
        <div className="pt-4 border-t border-slate-200 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 block">
            Création Rapide
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-bold">
            <button
              onClick={openAddParentModal}
              className="p-2 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl hover:bg-blue-100 transition-all text-center"
            >
              + Parent
            </button>
            <button
              onClick={openAddStaffModal}
              className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-all text-center"
            >
              + Éducatrice
            </button>
            <button
              onClick={openAddSectionModal}
              className="p-2 bg-purple-50 text-purple-900 border border-purple-200 rounded-xl hover:bg-purple-100 transition-all text-center"
            >
              + Classe
            </button>
            <button
              onClick={openSettingsModal}
              className="p-2 bg-slate-100 text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-200 transition-all text-center flex items-center justify-center gap-1"
            >
              <Settings className="w-3 h-3" /> Config
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={logout}
            className="w-full p-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Se Déconnecter</span>
          </button>
        </div>
      )}
    </aside>
  );
};
