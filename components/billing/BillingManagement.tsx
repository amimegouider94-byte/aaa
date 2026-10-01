'use client';

import React, { useEffect, useState } from 'react';
import { useAppStore, Invoice } from '@/lib/store';
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  CreditCard,
  FileSpreadsheet,
  Trash2,
  Zap,
  TrendingDown,
  UserPlus,
  X,
  Check,
  Database,
  RefreshCw,
} from 'lucide-react';
import { AccountingReportModal } from './AccountingReportModal';
import { ExpensesManagement } from './ExpensesManagement';

// ────────────────────────────────────────────────────────────────────────────────
// Modal: Frais d'inscription unique
// ────────────────────────────────────────────────────────────────────────────────
const RegistrationFeeModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { children, parents, createInvoice, daycareSettings, invoices } = useAppStore();
  const currency = daycareSettings.currency || 'DT';
  const regFee = daycareSettings.registrationFee || 200;

  const [selectedChildId, setSelectedChildId] = useState('');
  const [customAmount, setCustomAmount] = useState(String(regFee));

  const activeChildren = children.filter((c) => c.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const child = children.find((c) => c.id === selectedChildId);
    if (!child) return;
    const parent = parents.find((p) => p.id === child.parentId);
    const now = new Date();
    const invoiceNumber = `INSC-${now.getFullYear()}-${child.id.slice(-4).toUpperCase()}`;

    // Check if registration invoice already exists for this child
    const exists = invoices.some(
      (inv) => inv.childId === selectedChildId && inv.items.some((it) => it.description.includes('Inscription'))
    );
    if (exists) {
      alert('Une facture d\'inscription existe déjà pour cet enfant.');
      return;
    }

    createInvoice({
      invoiceNumber,
      childId: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      parentId: child.parentId,
      parentName: parent?.name || child.parentName,
      month: 'Inscription',
      issueDate: now.toISOString().split('T')[0],
      dueDate: now.toISOString().split('T')[0],
      items: [{ description: `Frais d'Inscription — ${child.firstName} ${child.lastName}`, amount: parseFloat(customAmount) }],
      totalAmount: parseFloat(customAmount),
      paidAmount: 0,
      status: 'pending',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">📋</div>
            <div>
              <h3 className="font-bold text-lg">Frais d'Inscription</h3>
              <p className="text-xs text-white/80">Facturer les frais d'entrée à un parent</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Enfant *</label>
            <select required value={selectedChildId} onChange={(e) => setSelectedChildId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold">
              <option value="">— Sélectionner un enfant —</option>
              {activeChildren.map((c) => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.sectionName})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Montant des Frais d'Inscription ({currency}) *</label>
            <input type="number" required min="0" step="0.01" value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-indigo-700" />
            <p className="text-[11px] text-slate-400 mt-1">Montant par défaut: {regFee} {currency} (modifiable dans Paramètres)</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Créer la Facture</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
// Main Billing Management Component
// ────────────────────────────────────────────────────────────────────────────────
export const BillingManagement: React.FC = () => {
  const {
    invoices,
    openAddPaymentModal,
    openReceiptModal,
    searchQuery,
    setSearchQuery,
    daycareSettings,
    role,
    deleteInvoice,
    generateMonthlyInvoices,
    fetchSupabaseData,
    isSupabaseLoading,
    t,
  } = useAppStore();

  const labels = t();
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [activeSection, setActiveSection] = useState<'invoices' | 'expenses'>('invoices');
  const [isAccountingReportOpen, setIsAccountingReportOpen] = useState(false);
  const [isRegFeeModalOpen, setIsRegFeeModalOpen] = useState(false);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  const currencySymbol = daycareSettings.currency || 'DT';

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchesSearch =
      inv.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalPending = invoices.reduce(
    (acc, inv) => acc + (inv.totalAmount - inv.paidAmount),
    0
  );

  const handleGenerateMonthly = () => {
    const count = generateMonthlyInvoices();
    if (count === 0) {
      alert('✅ Les factures de ce mois existent déjà pour tous les enfants inscrits. Aucune nouvelle facture créée.');
    } else {
      alert(`✅ ${count} nouvelle(s) facture(s) mensuelle(s) créée(s) avec succès !`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-nursery-coral" />
              {labels.billingTitle}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Database className="w-3 h-3 text-emerald-600" />
              <span>Supabase DB</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Facturation mensuelle, frais d'inscription, dépenses et rapport financier.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fetchSupabaseData()}
            disabled={isSupabaseLoading}
            className="bg-white border border-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-1.5 disabled:opacity-50"
            title="Re-fetch from Supabase DB"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-600 ${isSupabaseLoading ? 'animate-spin' : ''}`} />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setIsAccountingReportOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-nursery-orange" />
            <span>Rapport Comptable</span>
          </button>

          {role === 'admin' && (
            <>
              <button
                onClick={() => setIsRegFeeModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Frais d'Inscription</span>
              </button>

              <button
                onClick={handleGenerateMonthly}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-amber-500/20 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                <span>Générer Factures du Mois</span>
              </button>
            </>
          )}

          <button
            onClick={openAddPaymentModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Enregistrer Règlement</span>
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl border border-nursery-sand p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Encaissé</span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{totalCollected.toLocaleString()} {currencySymbol}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">✓</div>
        </div>

        <div className="bg-white rounded-3xl border border-nursery-sand p-5 shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reste à Recouvrer</span>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{totalPending.toLocaleString()} {currencySymbol}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl">⏳</div>
        </div>
      </div>

      {/* Section Tabs: Factures | Dépenses */}
      {role === 'admin' && (
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveSection('invoices')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'invoices' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" /> Factures ({invoices.length})
          </button>
          <button
            onClick={() => setActiveSection('expenses')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSection === 'expenses' ? 'bg-white text-rose-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" /> Dépenses
          </button>
        </div>
      )}

      {/* Conditional Rendering */}
      {activeSection === 'expenses' && role === 'admin' ? (
        <ExpensesManagement />
      ) : (
        <>
          {/* Filters & Search */}
          <div className="bg-white p-4 rounded-3xl border border-nursery-sand shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher facture, enfant ou parent..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-nursery-coral focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'paid', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === filter
                      ? filter === 'all' ? 'bg-slate-900 text-white'
                        : filter === 'paid' ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'all' ? 'Toutes' : filter === 'paid' ? 'Payées' : 'En Attente'}
                </button>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-white rounded-3xl border border-nursery-sand shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">N° Facture</th>
                    <th className="p-4">Enfant & Parent</th>
                    <th className="p-4">Mois / Type</th>
                    <th className="p-4">Montant Total</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-slate-900 font-mono text-xs">{inv.invoiceNumber}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{inv.childName}</p>
                        <p className="text-[11px] text-slate-400">{inv.parentName}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          inv.month === 'Inscription'
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inv.month === 'Inscription' ? '📋 Inscription' : inv.month}
                        </span>
                      </td>
                      <td className="p-4 font-black text-slate-900">{inv.totalAmount} {currencySymbol}</td>
                      <td className="p-4">
                        {inv.status === 'paid' ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Payé ({inv.paidDate})
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> En attente ({inv.totalAmount - inv.paidAmount} {currencySymbol})
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        <button
                          onClick={() => openReceiptModal(inv)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5 text-nursery-orange" />
                          <span>Reçu</span>
                        </button>
                        {role === 'admin' && (
                          <button
                            onClick={() => {
                              if (confirm(`Supprimer la facture N° ${inv.invoiceNumber} (${inv.childName}) ?`)) {
                                deleteInvoice(inv.id);
                              }
                            }}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-all"
                            title="Supprimer la facture"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvoices.length === 0 && (
                <div className="p-10 text-center text-slate-400 space-y-2">
                  <Receipt className="w-10 h-10 mx-auto opacity-30" />
                  <p className="font-bold text-slate-600">Aucune facture trouvée</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <AccountingReportModal isOpen={isAccountingReportOpen} onClose={() => setIsAccountingReportOpen(false)} />
      {isRegFeeModalOpen && <RegistrationFeeModal onClose={() => setIsRegFeeModalOpen(false)} />}
    </div>
  );
};
