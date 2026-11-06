'use client';

import React, { useState, useMemo } from 'react';
import { X, Plus, Trash2, Clock, CheckCircle } from 'lucide-react';
import { MonitoringSession, Attendee } from '../types';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (newSession: MonitoringSession) => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  onSessionCreated,
}) => {
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [sessionType, setSessionType] = useState<'Presencial' | 'Virtual' | 'Taller' | 'Asesoría'>('Presencial');
  const [subjectName, setSubjectName] = useState('Bases de Datos I');
  const [topic, setTopic] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [observation, setObservation] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  // Estados temporales para agregar un asistente
  const [studentCard, setStudentCard] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentProgram, setStudentProgram] = useState('Ingeniería de Sistemas');

  // Cálculo en tiempo real de horas computadas
  const computedHours = useMemo(() => {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      const startMin = startH * 60 + startM;
      const endMin = endH * 60 + endM;
      if (endMin <= startMin) return 0;
      return Number(((endMin - startMin) / 60).toFixed(2));
    } catch {
      return 0;
    }
  }, [startTime, endTime]);

  if (!isOpen) return null;

  const handleAddAttendee = () => {
    if (!studentCard.trim() || !studentName.trim()) return;
    setAttendees([
      ...attendees,
      {
        studentIdCard: studentCard.trim(),
        studentName: studentName.trim(),
        careerProgram: studentProgram,
      },
    ]);
    setStudentCard('');
    setStudentName('');
  };

  const handleRemoveAttendee = (index: number) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !observation.trim() || computedHours <= 0) return;

    const newSession: MonitoringSession = {
      id: 'session-' + Date.now(),
      monitorProfileId: 'author-profile-id',
      academicPeriodId: 'period-2026-2',
      subjectId: 'sub-1',
      subjectName,
      sessionDate,
      startTime,
      endTime,
      calculatedHours: computedHours,
      sessionType,
      topic,
      recordingUrl: recordingUrl.trim() || undefined,
      observation,
      status: 'APROBADO',
      source: 'DIRECT',
      attendees,
      createdAt: new Date().toISOString(),
    };

    onSessionCreated(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Registrar Nueva Monitoría</h3>
            <p className="text-xs text-slate-500">
              Formulario homologado con los campos institucionales del SIA de la Universidad Simón Bolívar.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Horario y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha Inicio: *</label>
              <input
                type="date"
                required
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hora Inicio: *</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hora Fin: *</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Banner de cómputo de horas */}
          <div className="bg-emerald-50/80 border border-emerald-200/70 p-2.5 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Tiempo efectivo que se computará a tu meta de 54 horas:</span>
            </div>
            <strong className="font-mono text-sm font-bold text-emerald-900">
              +{computedHours.toFixed(2)} horas
            </strong>
          </div>

          {/* Tipo y Asignatura */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo: *</label>
              <select
                value={sessionType}
                onChange={(e: any) => setSessionType(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Taller">Taller</option>
                <option value="Asesoría">Asesoría</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Asignatura: *</label>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="Bases de Datos I">Bases de Datos I</option>
                <option value="Estructuras de Datos">Estructuras de Datos</option>
                <option value="Programación Web y Móvil">Programación Web y Móvil</option>
                <option value="Algoritmos y Programación I">Algoritmos y Programación I</option>
                <option value="Arquitectura de Software">Arquitectura de Software</option>
                <option value="Cálculo Diferencial">Cálculo Diferencial</option>
              </select>
            </div>
          </div>

          {/* Tema */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tema Desarrollado: *</label>
            <input
              type="text"
              required
              placeholder="Ej: Normalización de bases de datos relacionales (1FN, 2FN, 3FN)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* URL Grabación */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">URL Grabación (opcional):</label>
            <input
              type="url"
              placeholder="https://teams.microsoft.com/..."
              value={recordingUrl}
              onChange={(e) => setRecordingUrl(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Observación: *</label>
            <textarea
              required
              rows={2}
              placeholder="Describe las actividades realizadas y dudas resueltas con los estudiantes..."
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Sección de Asistentes (Solución a la carencia del SIA) */}
          <div className="border-t border-slate-100 pt-3">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Estudiantes Atendidos ({attendees.length})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Cédula / Código"
                value={studentCard}
                onChange={(e) => setStudentCard(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg"
              />
              <input
                type="text"
                placeholder="Nombre completo"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-xs p-2 border border-slate-200 rounded-lg"
              />
              <div className="flex space-x-1">
                <input
                  type="text"
                  placeholder="Programa (Sistemas)"
                  value={studentProgram}
                  onChange={(e) => setStudentProgram(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddAttendee}
                  className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs hover:bg-slate-700 flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {attendees.length > 0 && (
              <div className="max-h-28 overflow-y-auto space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
                {attendees.map((att, i) => (
                  <div key={i} className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded border border-slate-100">
                    <span className="font-medium text-slate-700">{att.studentName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-400 text-[11px]">{att.studentIdCard}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(i)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botones del Formulario */}
          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-sm transition flex items-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Guardar en Historial</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
