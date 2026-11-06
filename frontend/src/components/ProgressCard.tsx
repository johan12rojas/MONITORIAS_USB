'use client';

import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Users, BookOpen, TrendingUp } from 'lucide-react';
import { MonitorProgress } from '../types';

interface ProgressCardProps {
  progress: MonitorProgress;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  const percentage = progress.progressPercentage;
  const isCompleted = progress.isCompleted;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Indicador Principal de las 54 Horas */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                Requisito Institucional USB
              </span>
              {isCompleted ? (
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Requisito Cumplido
                </span>
              ) : (
                <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                  <Clock className="w-3.5 h-3.5 mr-1" /> En Progreso
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-slate-500 font-mono">
              Meta: {progress.targetHours} horas
            </span>
          </div>

          <div className="flex items-baseline space-x-3 mb-3">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {progress.approvedHours.toFixed(1)}
              <span className="text-xl text-slate-400 font-normal"> / {progress.targetHours}h</span>
            </h2>
            <span className="text-lg font-bold text-emerald-700 font-mono">
              {percentage}%
            </span>
          </div>

          {/* Barra de Progreso Dinámica */}
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-500'
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <span>
              {isCompleted
                ? '¡Has completado el 100% de tus horas reglamentarias!'
                : `Faltan exactamente ${progress.remainingHours.toFixed(1)} horas para el cumplimiento.`}
            </span>
            {progress.pendingHours > 0 && (
              <span className="text-amber-600 font-medium">
                ({progress.pendingHours}h pendientes por revisión)
              </span>
            )}
          </div>
        </div>

        {/* Métricas Secundarias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Estudiantes</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">{progress.totalStudentsAttended}</p>
            <p className="text-[11px] text-slate-400">Atendidos en total</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sesiones</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">{progress.totalSessions}</p>
            <p className="text-[11px] text-slate-400">Registradas</p>
          </div>

          <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
            <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-violet-600" />
              <span>Promedio</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {progress.totalSessions > 0
                ? (progress.totalStudentsAttended / progress.totalSessions).toFixed(1)
                : '0'}
            </p>
            <p className="text-[11px] text-slate-400">Alumnos / sesión</p>
          </div>
        </div>
      </div>
    </div>
  );
};
