'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  FileSpreadsheet, 
  ExternalLink 
} from 'lucide-react';
import { MonitorSummary } from '../types';

interface CoordinatorDashboardProps {
  monitors: MonitorSummary[];
}

export const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({ monitors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CUMPLIDO' | 'ACTIVO'>('ALL');

  // Métricas consolidadas del programa (Ingeniería de Sistemas)
  const totalHours = useMemo(() => {
    return monitors.reduce((sum, m) => sum + m.accumulatedHours, 0);
  }, [monitors]);

  const totalStudents = useMemo(() => {
    return monitors.reduce((sum, m) => sum + m.totalStudentsAttended, 0);
  }, [monitors]);

  const completedMonitors = useMemo(() => {
    return monitors.filter((m) => m.status === 'CUMPLIDO').length;
  }, [monitors]);

  const averageCompliance = useMemo(() => {
    if (monitors.length === 0) return 0;
    const sum = monitors.reduce((acc, m) => acc + m.progressPercentage, 0);
    return Number((sum / monitors.length).toFixed(1));
  }, [monitors]);

  // Filtrado de la lista de monitores
  const filteredMonitors = useMemo(() => {
    return monitors.filter((m) => {
      const matchesSearch =
        searchTerm === '' ||
        m.monitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.institutionalCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [monitors, searchTerm, statusFilter]);

  const handleExportExcel = () => {
    alert('Generando consolidado oficial para la Dirección de Docencia (Formato Excel)...');
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas de Métricas Macro (Director de Programa / Coordinador) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Horas Totales del Semestre</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">{totalHours.toFixed(0)}h</p>
          <p className="text-xs text-slate-500 mt-1">Acumuladas por 20 monitores</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Estudiantes Beneficiados</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">{totalStudents}</p>
          <p className="text-xs text-slate-500 mt-1">Atenciones registradas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Cumplimiento del Requisito</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">
            {completedMonitors} <span className="text-base text-slate-400 font-normal">/ {monitors.length}</span>
          </p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            {((completedMonitors / monitors.length) * 100).toFixed(0)}% de monitores al día
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Avance Promedio Global</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 font-mono">{averageCompliance}%</p>
          <p className="text-xs text-slate-500 mt-1">Meta semestral de 54 horas</p>
        </div>
      </div>

      {/* Matriz Consolidada de Monitores (Supera al Excel dinámico de Pág. 4) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Matriz Consolidada de Monitores (Ingeniería de Sistemas)
            </h3>
            <p className="text-xs text-slate-500">
              Supervisión en tiempo real del progreso hacia las 54 horas requeridas por monitor.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Exportar Reporte Excel</span>
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por código (ej: MONITOR14) o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Todos ({monitors.length})
            </button>
            <button
              onClick={() => setStatusFilter('CUMPLIDO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'CUMPLIDO'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              Cumplidos (≥54h)
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'ACTIVO'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              En Progreso
            </button>
          </div>
        </div>

        {/* Tabla Consolidada */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Monitor / Código</th>
                <th className="py-3 px-4 text-center">Horas Acumuladas</th>
                <th className="py-3 px-4">Progreso a 54 Horas</th>
                <th className="py-3 px-4 text-center">Estudiantes Atendidos</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMonitors.map((m) => (
                <tr key={m.monitorProfileId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{m.monitorName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{m.institutionalCode}</div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap font-mono font-bold text-slate-800 text-sm">
                    {m.accumulatedHours.toFixed(1)}h
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap min-w-[180px]">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            m.status === 'CUMPLIDO' ? 'bg-emerald-600' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(m.progressPercentage, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-semibold text-slate-600 w-10 text-right">
                        {m.progressPercentage}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap font-mono font-medium text-slate-700">
                    {m.totalStudentsAttended} alumnos
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {m.status === 'CUMPLIDO' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Cumplido
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 mr-1" /> Faltan {m.remainingHours.toFixed(1)}h
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => alert(`Auditar sesiones de ${m.monitorName} (${m.institutionalCode})`)}
                      className="text-slate-500 hover:text-emerald-700 font-medium text-[11px] underline"
                    >
                      Auditar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
