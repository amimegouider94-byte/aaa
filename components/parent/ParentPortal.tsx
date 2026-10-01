'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  Baby,
  CalendarCheck,
  Receipt,
  BookOpenText,
  Megaphone,
  Printer,
  CheckCircle2,
  Clock,
  Heart,
  Phone,
  Mail,
} from 'lucide-react';

export const ParentPortal: React.FC = () => {
  const {
    parents,
    currentUser,
    children,
    attendance,
    dailyLogs,
    invoices,
    announcements,
    openReceiptModal,
    daycareSettings,
    t,
  } = useAppStore();

  const labels = t();
  const currencySymbol = daycareSettings.currency || 'DT';

  // Lock portal to the logged-in parent — never allow switching
  const currentParent = parents.find((p) => p.id === currentUser?.id) || parents[0];
  const myChildren = children.filter((c) => currentParent?.childrenIds?.includes(c.id));

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Parent Banner */}
      <div className="bg-gradient-to-r from-nursery-purple/90 via-indigo-500 to-nursery-sky p-6 rounded-3xl text-white shadow-xl shadow-nursery-purple/15 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={currentParent.avatar}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/30 shadow-md"
            />
            <div>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md inline-block mb-1">
                👋 Bienvenue dans votre Espace Parent
              </span>
              <h2 className="text-2xl font-black">{currentParent.name}</h2>
              <p className="text-xs text-white/80 mt-0.5 flex items-center gap-3">
                <span>📧 {currentParent.email}</span>
                <span>📞 {currentParent.phone}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2.5 rounded-2xl text-xs font-semibold text-white border border-white/20">
            <span>Enfant(s) inscrit(s): {myChildren.length}</span>
          </div>
        </div>
      </div>

      {/* Children Overview Cards Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Baby className="w-5 h-5 text-nursery-purple" />
          Fiche & Suivi de mon Enfant
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myChildren.map((child) => {
            const todayAtt = attendance.find((a) => a.childId === child.id && a.date === todayStr);
            const childLogs = dailyLogs.filter((l) => l.childId === child.id);
            const latestLog = childLogs[0];

            return (
              <div
                key={child.id}
                className="bg-white rounded-3xl border border-nursery-sand shadow-card p-5 space-y-4 hover:shadow-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={child.photo}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover ring-4 ring-nursery-purple-light"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-nursery-purple-light text-nursery-purple-dark">
                      {child.sectionName}
                    </span>
                    <h4 className="font-bold text-slate-900 text-lg mt-0.5">
                      {child.firstName} {child.lastName}
                    </h4>
                    <p className="text-xs text-slate-500">Né(e) le {child.dateOfBirth}</p>
                  </div>
                </div>

                {/* Today's Status Summary */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Pointage d'Aujourd'hui
                    </span>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {todayAtt?.status === 'present'
                        ? 'Présent(e) à la garderie ✅'
                        : todayAtt?.status === 'late'
                        ? 'En Retard ⏳'
                        : 'Absent(e)'}
                    </p>
                  </div>
                  {todayAtt?.checkInTime && (
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-xl text-xs">
                      Arrivé(e) à {todayAtt.checkInTime}
                    </span>
                  )}
                </div>

                {/* Latest Educator Journal Entry */}
                {latestLog ? (
                  <div className="p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-purple-900">
                      <span>📝 Dernier journal des éducatrices</span>
                      <span className="text-[10px] opacity-75">{latestLog.createdAt}</span>
                    </div>
                    <p className="text-slate-700 italic">"{latestLog.educatorNote}"</p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    Aucun journal n'a encore été rédigé pour aujourd'hui.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices & Receipts for Parent */}
      <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Receipt className="w-5 h-5 text-nursery-orange" />
          Mes Factures & Reçus de Scolarité
        </h3>

        <div className="space-y-3">
          {invoices
            .filter((inv) => myChildren.some((c) => c.id === inv.childId))
            .map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{inv.invoiceNumber}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {inv.status === 'paid' ? 'Payé' : 'En Attente'}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">
                    Enfant: <span className="font-semibold text-slate-800">{inv.childName}</span> — Période: {inv.month}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="font-black text-slate-900 text-base">{inv.totalAmount} {currencySymbol}</span>
                  <button
                    onClick={() => openReceiptModal(inv)}
                    className="bg-nursery-orange-light text-nursery-orange-dark font-bold px-3.5 py-2 rounded-xl hover:bg-nursery-orange hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Reçu PDF
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Daycare Announcements Feed */}
      <div className="bg-white rounded-3xl border border-nursery-sand shadow-card p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-nursery-sky" />
          Annonces & Communication Garderie
        </h3>

        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                <span className="text-[10px] text-slate-400">{ann.date}</span>
              </div>
              <p className="text-slate-600 leading-relaxed">{ann.content}</p>
              <p className="text-[10px] text-slate-400 pt-1">Publié par: {ann.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
