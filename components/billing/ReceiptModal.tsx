'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { X, Printer, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { isReceiptModalOpen, selectedInvoiceForReceipt, closeReceiptModal, daycareSettings } = useAppStore();

  if (!isReceiptModalOpen || !selectedInvoiceForReceipt) return null;

  const inv = selectedInvoiceForReceipt;
  const currencySymbol = daycareSettings.currency || 'DT';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8 print:shadow-none print:border-none print:w-full">
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-nursery-orange" />
            <span className="font-bold text-sm">Aperçu du Reçu Officiel - {inv.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-nursery-orange hover:bg-nursery-orange-dark text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer / PDF</span>
            </button>
            <button
              onClick={closeReceiptModal}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Canvas */}
        <div className="p-8 sm:p-10 space-y-6 bg-white text-slate-800" id="printable-receipt">
          {/* Receipt Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-200 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{daycareSettings.logo || '🎈'}</span>
                <div>
                  <h1 className="text-xl font-black tracking-tight text-slate-900">
                    {daycareSettings.name}
                  </h1>
                  <p className="text-xs text-slate-500 font-semibold">
                    {daycareSettings.subtitle}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                <p>{daycareSettings.address}</p>
                <p>SIRET: {daycareSettings.siret}</p>
                <p>Tél: {daycareSettings.phone} | Email: {daycareSettings.email}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                Reçu de Paiement
              </span>
              <h2 className="text-lg font-black text-nursery-orange-dark">{inv.invoiceNumber}</h2>
              <p className="text-xs text-slate-600 mt-1">Date d'Émission: {inv.issueDate}</p>
              <p className="text-xs text-slate-600">Période: {inv.month}</p>
              
              {inv.status === 'paid' && (
                <div className="mt-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-xs px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>REÇU ACQUITTÉ (PAYÉ)</span>
                </div>
              )}
            </div>
          </div>

          {/* Billing Info Grid */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Destinataire (Parents)
              </span>
              <p className="font-bold text-slate-900 text-sm">{inv.parentName}</p>
              <p className="text-slate-600 mt-0.5">Identifiant Parent: {inv.parentId}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Enfant Concerné
              </span>
              <p className="font-bold text-slate-900 text-sm">{inv.childName}</p>
              <p className="text-slate-600 mt-0.5">Facturation Mensuelle Garderie</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Détail des Prestations
            </h4>
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Montant ({currencySymbol})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inv.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-medium text-slate-800">{item.description}</td>
                    <td className="p-3 text-right font-bold text-slate-900">{item.amount.toFixed(2)} {currencySymbol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total & Payment Method Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-xs space-y-1">
              <p className="text-slate-600 font-semibold">
                Mode de Règlement: <span className="font-bold text-slate-900">{inv.paymentMethod || 'Espèces'}</span>
              </p>
              <p className="text-slate-500 text-[11px]">
                Règlement effectué le: {inv.paidDate || inv.issueDate}
              </p>
              <p className="text-slate-400 text-[10px] italic">
                Règlement des frais de garderie et prise en charge de l'enfant
              </p>
            </div>

            <div className="bg-nursery-orange-light/60 border border-nursery-orange/30 p-4 rounded-2xl text-right min-w-[200px]">
              <span className="text-xs font-bold text-nursery-orange-dark uppercase tracking-wider block">
                Total Réglé
              </span>
              <span className="text-3xl font-black text-slate-900">{inv.totalAmount.toFixed(2)} {currencySymbol}</span>
            </div>
          </div>

          {/* Stamp & Signature area */}
          <div className="pt-6 flex justify-between items-end text-xs text-slate-400 border-t border-dashed border-slate-200">
            <div>
              <p className="font-semibold text-slate-600">Cachet de la Direction:</p>
              <div className="w-32 h-16 mt-2 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-[10px] text-slate-400">
                [ Cachet {daycareSettings.name} ]
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-600">La Direction,</p>
              <p className="text-slate-800 font-bold mt-6">{daycareSettings.directorName}</p>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end print:hidden">
          <button
            onClick={closeReceiptModal}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
