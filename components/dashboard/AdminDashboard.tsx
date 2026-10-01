'use client';

import React, { useState } from 'react';
import { useAppStore, Section } from '@/lib/store';
import {
  Baby,
  Users,
  CalendarCheck2,
  Receipt,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { EditSectionModal } from '../admin/EditSectionModal';

export const AdminDashboard: React.FC = () => {
  const {
    children,
    parents,
    sections,
    attendance,
    invoices,
    openAddChildModal,
    openAddSectionModal,
    openAddPaymentModal,
    daycareSettings,
    t,
  } = useAppStore();

  const labels = t();
  const [selectedSectionToEdit, setSelectedSectionToEdit] = useState<Section | null>(null);

  // Metrics
  const totalChildren = children.length;
  const activeChildren = children.filter((c) => c.status === 'active').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === todayStr);
  const presentCount = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const attendanceRate = totalChildren > 0 ? Math.round((presentCount / totalChildren) * 100) : 0;

  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const pendingRevenue = invoices.reduce(
    (acc, inv) => acc + (inv.totalAmount - inv.paidAmount),
    0
  );

  const currencySymbol = daycareSettings.currency || 'DT';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-nursery-orange via-nursery-coral to-rose-400 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tableau de Bord Direction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bonjour, Bienvenue sur {daycareSettings.name}!
          </h1>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            Voici un aperçu en temps réel de vos inscriptions, taux de présence du jour et santé financière en {currencySymbol}.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Children */}
        <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-3 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enfants Inscrits
            </span>
            <div className="w-10 h-10 rounded-2xl bg-nursery-orange-light text-nursery-orange flex items-center justify-center font-bold">
              <Baby className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{activeChildren}</span>
            <span className="text-xs font-semibold text-emerald-600">/ {totalChildren} total</span>
          </div>
        </div>

        {/* Presence Today */}
        <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-3 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Présence Aujourd'hui
            </span>
            <div className="w-10 h-10 rounded-2xl bg-nursery-mint-light text-nursery-mint-dark flex items-center justify-center font-bold">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-slate-500">({presentCount} présents)</span>
          </div>
        </div>

        {/* Revenue Paid */}
        <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-3 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Revenus Encaissés
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalRevenue.toLocaleString()} {currencySymbol}</span>
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-3 hover:shadow-hover transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Règlements en Attente
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">{pendingRevenue.toLocaleString()} {currencySymbol}</span>
          </div>
        </div>
      </div>

      {/* Sections / Classes Management Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Structure des Classes & Tranches d'Âge</h3>
            <p className="text-xs text-slate-500">Gestion des sections, éducatrices référentes et capacités</p>
          </div>
          <button
            onClick={openAddSectionModal}
            className="px-3.5 py-2 rounded-2xl bg-nursery-mint-dark hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter Classe</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((sec) => {
            const countInSec = children.filter((c) => c.sectionId === sec.id).length;
            return (
              <div
                key={sec.id}
                className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-3 relative hover:shadow-hover transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {sec.ageRange}
                    </span>
                    <h4 className="font-bold text-slate-900 text-lg mt-1">{sec.name}</h4>
                    <p className="text-xs font-medium text-slate-500">{sec.codeName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedSectionToEdit(sec)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                    title="Modifier Section"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>
                    <strong>Éducatrice:</strong> {sec.educatorName}
                  </p>
                  <p>
                    <strong>Localisation:</strong> {sec.roomNumber}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-400">Effectif:</span>
                  <span className="text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl">
                    {countInSec} / {sec.capacity} enfants
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Section Modal */}
      <EditSectionModal
        section={selectedSectionToEdit}
        isOpen={!!selectedSectionToEdit}
        onClose={() => setSelectedSectionToEdit(null)}
      />
    </div>
  );
};
