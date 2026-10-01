'use client';

import React, { useState } from 'react';
import { useAppStore, Invoice } from '@/lib/store';
import { X, CreditCard, Sparkles, Check, UserPlus, FileText } from 'lucide-react';

export const NewPaymentModal: React.FC = () => {
  const {
    isAddPaymentOpen,
    closeAddPaymentModal,
    invoices,
    parents,
    children,
    addPayment,
    createInvoice,
    daycareSettings,
  } = useAppStore();

  const currencySymbol = daycareSettings.currency || 'DT';

  const unpaidInvoices = invoices.filter((inv) => inv.status !== 'paid');

  // Mode: 'invoice' (select existing invoice) or 'parent' (direct payment by parent)
  const [paymentMode, setPaymentMode] = useState<'invoice' | 'parent'>('invoice');

  // Mode 'invoice' state
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    unpaidInvoices[0]?.id || invoices[0]?.id || ''
  );

  // Mode 'parent' state
  const [selectedParentId, setSelectedParentId] = useState(parents[0]?.id || '');
  const [selectedChildId, setSelectedChildId] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('Frais de Garderie / Scolarité');
  const [month, setMonth] = useState('Septembre 2026');

  // Shared state
  const [amountPaid, setAmountPaid] = useState<number>(600);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('Espèces');

  if (!isAddPaymentOpen) return null;

  const currentInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMode === 'invoice') {
      if (!selectedInvoiceId) return;
      addPayment(selectedInvoiceId, Number(amountPaid), paymentMethod);
    } else {
      // Direct payment by parent
      const parentObj = parents.find((p) => p.id === selectedParentId) || parents[0];
      if (!parentObj) return;

      const parentChildren = children.filter((c) => parentObj.childrenIds.includes(c.id));
      const childObj = parentChildren.find((c) => c.id === selectedChildId) || parentChildren[0] || children[0];

      const invNum = `FAC-${Date.now().toString().slice(-6)}`;
      const today = new Date().toISOString().split('T')[0];

      createInvoice({
        invoiceNumber: invNum,
        childId: childObj ? childObj.id : 'general',
        childName: childObj ? `${childObj.firstName} ${childObj.lastName}` : 'Enfant Inscrit',
        parentId: parentObj.id,
        parentName: parentObj.name,
        month,
        issueDate: today,
        dueDate: today,
        paidDate: today,
        items: [
          {
            description: paymentDescription || 'Frais de Garderie / Scolarité',
            amount: Number(amountPaid),
          },
        ],
        totalAmount: Number(amountPaid),
        paidAmount: Number(amountPaid),
        status: 'paid',
        paymentMethod,
      });
    }

    closeAddPaymentModal();
  };

  const selectedParentObj = parents.find((p) => p.id === selectedParentId);
  const availableChildren = selectedParentObj
    ? children.filter((c) => selectedParentObj.childrenIds.includes(c.id))
    : children;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl">
              💳
            </div>
            <div>
              <h3 className="font-bold text-lg">Enregistrer un Règlement</h3>
              <p className="text-xs text-white/80">Saisie des encaissments de frais de garderie ({currencySymbol})</p>
            </div>
          </div>
          <button
            onClick={closeAddPaymentModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setPaymentMode('invoice')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'invoice'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Payer Facture Existante</span>
          </button>
          <button
            type="button"
            onClick={() => setPaymentMode('parent')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              paymentMode === 'parent'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>Nouveau Règlement par Parent</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {paymentMode === 'invoice' ? (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Facture Concernée</label>
              <select
                value={selectedInvoiceId}
                onChange={(e) => {
                  setSelectedInvoiceId(e.target.value);
                  const inv = invoices.find((i) => i.id === e.target.value);
                  if (inv) setAmountPaid(inv.totalAmount - inv.paidAmount || inv.totalAmount);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none font-medium"
              >
                {invoices.length > 0 ? (
                  invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} — {inv.childName} ({inv.totalAmount - inv.paidAmount} {currencySymbol} restant) [{inv.status.toUpperCase()}]
                    </option>
                  ))
                ) : (
                  <option value="">Aucune facture trouvée</option>
                )}
              </select>

              {currentInvoice && (
                <div className="mt-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Parents: {currentInvoice.parentName}</p>
                  <p className="text-slate-600">
                    Total Facturé: {currentInvoice.totalAmount} {currencySymbol} | Déjà Réglé: {currentInvoice.paidAmount} {currencySymbol}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Mode 'parent' - Direct Parent Selection */
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sélectionner le Parent *</label>
                <select
                  value={selectedParentId}
                  onChange={(e) => {
                    setSelectedParentId(e.target.value);
                    const p = parents.find((par) => par.id === e.target.value);
                    if (p && p.childrenIds.length > 0) {
                      setSelectedChildId(p.childrenIds[0]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-teal-500 focus:outline-none"
                >
                  {parents.map((p) => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              {availableChildren.length > 0 && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Enfant Concerné</label>
                  <select
                    value={selectedChildId}
                    onChange={(e) => setSelectedChildId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {availableChildren.map((c) => (
                      <option key={c.id} value={c.id}>
                        👶 {c.firstName} {c.lastName} ({c.sectionName})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Période / Mois</label>
                  <input
                    type="text"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Libellé Prestation</label>
                  <input
                    type="text"
                    value={paymentDescription}
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Montant du Règlement ({currencySymbol}) *
            </label>
            <input
              type="number"
              required
              min="1"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-black text-slate-900 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Mode de Paiement</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Espèces', 'Virement Bancaire', 'Chèque', 'Carte'] as const).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                    paymentMethod === method
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeAddPaymentModal}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Valider et Générer Reçu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
