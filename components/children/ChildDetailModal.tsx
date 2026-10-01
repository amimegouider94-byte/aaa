'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import {
  X,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  Heart,
  Briefcase,
  User,
  Clock,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const ChildDetailModal: React.FC = () => {
  const { selectedChildDetail, closeChildDetailModal, attendance, dailyLogs } = useAppStore();

  if (!selectedChildDetail) return null;

  const child = selectedChildDetail;

  // Calculate age
  const birthYear = new Date(child.dateOfBirth).getFullYear();
  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - birthYear;

  // Child's attendance history
  const childAttendance = attendance.filter((a) => a.childId === child.id);
  // Child's daily logs
  const childLogs = dailyLogs.filter((l) => l.childId === child.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-nursery-sand overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-nursery-orange to-nursery-coral p-6 text-white relative">
          <button
            onClick={closeChildDetailModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={child.photo}
              alt=""
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="text-center sm:text-left">
              <span className="bg-white/20 text-white text-[10px] font-extrabold px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-wider">
                {child.sectionName}
              </span>
              <h2 className="text-2xl font-black mt-1">
                {child.firstName} {child.lastName}
              </h2>
              <p className="text-xs text-white/80 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                <span>🎂 {ageYears} ans ({child.dateOfBirth})</span>
                <span>•</span>
                <span>Inscrit le {child.enrollmentDate}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Medical & Allergies Alert Box */}
          <div
            className={`p-4 rounded-2xl border ${
              child.hasMedicalAlert
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle className={`w-4 h-4 ${child.hasMedicalAlert ? 'text-rose-600' : 'text-emerald-600'}`} />
              <h4 className="font-bold text-sm">Fiche Santé & Recommandations</h4>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {child.medicalNotes.map((note, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-xl font-bold ${
                    child.hasMedicalAlert
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Emergency Contact & Parents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emergency Contact */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-nursery-orange" />
                Contact d'Urgence
              </h4>
              <p className="font-bold text-slate-800 text-sm">{child.emergencyContact.name}</p>
              <p className="text-xs text-slate-600">Lien: {child.emergencyContact.relationship}</p>
              <a
                href={`tel:${child.emergencyContact.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold text-nursery-orange bg-nursery-orange-light px-3 py-1.5 rounded-xl hover:bg-nursery-orange hover:text-white transition-all"
              >
                <Phone className="w-3 h-3" /> Appeler: {child.emergencyContact.phone}
              </a>
            </div>

            {/* Linked Parent Information */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-nursery-purple" />
                Parents Associés
              </h4>
              <p className="font-bold text-slate-800 text-sm">{child.parentName}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="w-3 h-3" /> {child.parentEmail}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {child.parentPhone}
              </p>
            </div>
          </div>

          {/* Attendance History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-nursery-mint" />
              Historique Récent de Présence
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {childAttendance.slice(0, 4).map((att) => (
                <div key={att.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-[10px] text-slate-400 block">{att.date}</span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                      att.status === 'present'
                        ? 'bg-emerald-100 text-emerald-800'
                        : att.status === 'late'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {att.status === 'present' ? 'Présent' : att.status === 'late' ? 'En retard' : 'Absent'}
                  </span>
                  {att.checkInTime && (
                    <span className="text-[10px] text-slate-500 block mt-0.5">⏱️ {att.checkInTime}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Educator Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-nursery-purple" />
              Notes de l'Éducatrice ({childLogs.length})
            </h4>
            {childLogs.length > 0 ? (
              childLogs.map((log) => (
                <div key={log.id} className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs">
                  <div className="flex justify-between font-semibold text-purple-900">
                    <span>{log.educatorName}</span>
                    <span className="text-[10px] opacity-75">{log.date} - {log.createdAt}</span>
                  </div>
                  <p className="text-slate-700 mt-1">{log.educatorNote}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Aucune note enregistrée pour cet enfant aujourd'hui.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeChildDetailModal}
            className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all"
          >
            Fermer le Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
