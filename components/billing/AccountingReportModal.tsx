'use client';

import React, { useState } from 'react';
import { useAppStore, Invoice } from '@/lib/store';
import { X, Printer, Calendar, FileSpreadsheet, Download, TrendingUp, DollarSign } from 'lucide-react';

interface AccountingReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountingReportModal: React.FC<AccountingReportModalProps> = ({ isOpen, onClose }) => {
  const { invoices, daycareSettings } = useAppStore();

  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-30');

  if (!isOpen) return null;

  const currencySymbol = daycareSettings.currency || 'DT';

  // Filter invoices by date range
  const filteredInvoices = invoices.filter((inv) => {
    const invDate = inv.paidDate || inv.issueDate;
    return invDate >= startDate && invDate <= endDate;
  });

  // Financial Calculations
  const totalRevenue = filteredInvoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingAmount = totalInvoiced - totalRevenue;

  // Estimated expenses (e.g. 40% estimated overhead)
  const estimatedCharges = Math.round(totalRevenue * 0.35);
  const netProfit = totalRevenue - estimatedCharges;

  // Breakdown by payment method
  const paidByCash = filteredInvoices
    .filter((inv) => inv.paymentMethod === 'Espèces')
    .reduce((acc, inv) => acc + inv.paidAmount, 0);
  const paidByBank = filteredInvoices
    .filter((inv) => inv.paymentMethod === 'Virement Bancaire')
    .reduce((acc, inv) => acc + inv.paidAmount, 0);
  const paidByCheque = filteredInvoices
    .filter((inv) => inv.paymentMethod === 'Chèque')
    .reduce((acc, inv) => acc + inv.paidAmount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Modal Control Header (Hidden when printing) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-xl">
              📊
            </div>
            <div>
              <h3 className="font-bold text-lg">Rapport Comptable & Profit par Dates</h3>
              <p className="text-xs text-white/70">Extraction des chiffres pour l'expert comptable</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-nursery-orange text-white font-bold text-xs shadow-lg hover:bg-nursery-orange-dark transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Date Filter Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs font-bold print:hidden">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" /> Période d'Analyse :
            </span>
            <div className="flex items-center gap-2">
              <span>Du</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium"
              />
              <span>Au</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <span className="bg-indigo-100 text-indigo-900 px-3 py-1.5 rounded-xl">
            {filteredInvoices.length} transactions trouvées
          </span>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 space-y-6 text-slate-800 printable-area max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Official Document Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{daycareSettings.name}</h1>
              <p className="text-xs text-slate-500 font-medium">{daycareSettings.subtitle}</p>
              <p className="text-xs text-slate-500 mt-1">SIRET: {daycareSettings.siret} | Tél: {daycareSettings.phone}</p>
              <p className="text-xs text-slate-500">Direction: {daycareSettings.directorName}</p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 block">
                RAPPORT FINANCIER COMPTABLE
              </span>
              <p className="text-sm font-bold text-indigo-900 mt-1">
                Période: {startDate} au {endDate}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Généré le: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Financial Metrics Summary Grid */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Chiffre d'Affaires Brut
              </span>
              <p className="text-xl font-black text-slate-900 mt-1">{totalRevenue.toLocaleString()} {currencySymbol}</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Reliquat Non Encaissé
              </span>
              <p className="text-xl font-black text-amber-900 mt-1">{pendingAmount.toLocaleString()} {currencySymbol}</p>
            </div>

            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                Charges Estimées (~35%)
              </span>
              <p className="text-xl font-black text-rose-900 mt-1">{estimatedCharges.toLocaleString()} {currencySymbol}</p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Bénéfice Net Estimé
              </span>
              <p className="text-xl font-black text-emerald-900 mt-1">{netProfit.toLocaleString()} {currencySymbol}</p>
            </div>
          </div>

          {/* Payment Methods Distribution */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-around text-xs font-semibold text-indigo-950">
            <span>💵 Espèces: <strong>{paidByCash} {currencySymbol}</strong></span>
            <span>🏦 Virement Bancaire: <strong>{paidByBank} {currencySymbol}</strong></span>
            <span>📝 Chèque: <strong>{paidByCheque} {currencySymbol}</strong></span>
          </div>

          {/* Itemized Transactions Table */}
          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
              Détail du Journal des Recettes ({filteredInvoices.length} écritures)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">N° Facture</th>
                  <th className="p-2.5">Enfant / Parent</th>
                  <th className="p-2.5">Mode Règlement</th>
                  <th className="p-2.5">Statut</th>
                  <th className="p-2.5 text-right">Montant Encaissé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium">{inv.paidDate || inv.issueDate}</td>
                    <td className="p-2.5 font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="p-2.5">
                      <p className="font-bold text-slate-800">{inv.childName}</p>
                      <p className="text-[10px] text-slate-400">{inv.parentName}</p>
                    </td>
                    <td className="p-2.5 font-medium">{inv.paymentMethod || 'Non spécifié'}</td>
                    <td className="p-2.5 font-bold">
                      {inv.status === 'paid' ? (
                        <span className="text-emerald-700">✓ Payé</span>
                      ) : (
                        <span className="text-amber-700">⏳ En attente</span>
                      )}
                    </td>
                    <td className="p-2.5 text-right font-black text-slate-900">
                      {inv.paidAmount} {currencySymbol}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures & Certification Stamp */}
          <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-600 print:mt-12">
            <div>
              <p className="font-bold">Cachet & Signature Direction</p>
              <div className="mt-8 border-b border-slate-300 w-48" />
            </div>
            <div>
              <p className="font-bold">Visa Expert Comptable</p>
              <div className="mt-8 border-b border-slate-300 w-48" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
