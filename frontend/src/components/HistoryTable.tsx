'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Video, 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileDown, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { MonitoringSession } from '../types';

interface HistoryTableProps {
  sessions: MonitoringSession[];
  onOpenNewSessionModal: () => void;
  onOpenImportModal: () => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  sessions,
  onOpenNewSessionModal,
  onOpenImportModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Obtener lista única de asignaturas para el dropdown
  const subjectsList = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.subjectName) set.add(s.subjectName);
    });
    return Array.from(set);
  }, [sessions]);

  // Filtrado multidimensional
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesSearch =
        searchTerm === '' ||
        s.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.observation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.attendees &&
          s.attendees.some((a) =>
            a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.studentIdCard.includes(searchTerm)
          ));

      const matchesSubject = selectedSubject === 'ALL' || s.subjectName === selectedSubject;
      const matchesType = selectedType === 'ALL' || s.sessionType === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || s.status === selectedStatus;

      return matchesSearch && matchesSubject && matchesType && matchesStatus;
    });
  }, [sessions, searchTerm, selectedSubject, selectedType, selectedStatus]);

  const toggleExpand = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Cabecera y Botones de Acción */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Historial y Trazabilidad de Monitorías</h3>
          <p className="text-xs text-slate-500">
            Consulta tus sesiones registradas, valida tus horas y haz seguimiento a los estudiantes atendidos.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenImportModal}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <FileDown className="w-4 h-4" />
            <span>Importar SIA (Excel)</span>
          </button>
          <button
            onClick={onOpenNewSessionModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition"
          >
            <span>+ Registrar Monitoría</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Multicriterio */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Buscador de Texto */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar tema, notas o estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Filtro por Asignatura */}
        <div>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
          >
            <option value="ALL">Todas las Asignaturas</option>
            {subjectsList.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Modalidad */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
          >
            <option value="ALL">Todas las Modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Taller">Taller</option>
            <option value="Asesoría">Asesoría</option>
          </select>
        </div>

        {/* Filtro por Estado */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-1.5 px-3 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="APROBADO">Aprobadas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="OBSERVADO">Con Observaciones</option>
          </select>
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Fecha y Horario</th>
              <th className="py-3 px-4">Asignatura</th>
              <th className="py-3 px-4">Tema Tratado</th>
              <th className="py-3 px-4 text-center">Modalidad</th>
              <th className="py-3 px-4 text-center">Estudiantes</th>
              <th className="py-3 px-4 text-center">Horas</th>
              <th className="py-3 px-4 text-center">Estado</th>
              <th className="py-3 px-4 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredSessions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <p className="font-medium">No se encontraron monitorías con los filtros seleccionados.</p>
                  <p className="text-[11px] mt-1">Prueba cambiando los criterios o registrando una nueva monitoría.</p>
                </td>
              </tr>
            ) : (
              filteredSessions.map((session) => (
                <React.Fragment key={session.id}>
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    {/* Fecha y Horario */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{session.sessionDate}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {session.startTime} - {session.endTime}
                      </div>
                    </td>

                    {/* Asignatura */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-700">
                      {session.subjectName || 'General'}
                    </td>

                    {/* Tema */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-800" title={session.topic}>
                      {session.topic}
                    </td>

                    {/* Modalidad */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {session.sessionType}
                      </span>
                    </td>

                    {/* Estudiantes */}
                    <td className="py-3 px-4 text-center whitespace-nowrap font-mono">
                      <span className="inline-flex items-center space-x-1 text-slate-700">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>{session.attendees ? session.attendees.length : 0}</span>
                      </span>
                    </td>

                    {/* Horas */}
                    <td className="py-3 px-4 text-center whitespace-nowrap font-mono font-bold text-slate-800">
                      +{session.calculatedHours.toFixed(1)}h
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {session.status === 'APROBADO' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle className="w-3 h-3 mr-1" /> Aprobada
                        </span>
                      )}
                      {session.status === 'PENDIENTE' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3 mr-1" /> Pendiente
                        </span>
                      )}
                      {session.status === 'OBSERVADO' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Observada
                        </span>
                      )}
                    </td>

                    {/* Botón expandir */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => toggleExpand(session.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100"
                      >
                        {expandedSessionId === session.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Fila Desplegable de Detalle */}
                  {expandedSessionId === session.id && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={8} className="p-4 border-t border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <p className="font-semibold text-slate-700 mb-1">Observaciones registradas:</p>
                            <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                              {session.observation}
                            </p>
                            {session.recordingUrl && (
                              <div className="mt-2 flex items-center space-x-1.5 text-blue-600">
                                <Video className="w-3.5 h-3.5" />
                                <a
                                  href={session.recordingUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline flex items-center space-x-1 hover:text-blue-800"
                                >
                                  <span>Ver grabación de la sesión</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-700 mb-1">
                              Estudiantes atendidos ({session.attendees?.length || 0}):
                            </p>
                            {session.attendees && session.attendees.length > 0 ? (
                              <ul className="space-y-1 bg-white p-2.5 rounded-lg border border-slate-200 max-h-28 overflow-y-auto">
                                {session.attendees.map((att, i) => (
                                  <li key={i} className="flex justify-between text-slate-600">
                                    <span>{att.studentName}</span>
                                    <span className="font-mono text-slate-400">{att.studentIdCard}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-slate-400 italic bg-white p-2.5 rounded-lg border border-slate-200">
                                No se asociaron estudiantes individualmente en esta sesión.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pie de Tabla con Resumen */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-xs text-slate-500 flex justify-between items-center">
        <span>Mostrando {filteredSessions.length} de {sessions.length} monitorías</span>
        <span>
          Horas filtradas:{' '}
          <strong className="text-slate-800 font-mono">
            {filteredSessions.reduce((acc, s) => acc + s.calculatedHours, 0).toFixed(1)}h
          </strong>
        </span>
      </div>
    </div>
  );
};
