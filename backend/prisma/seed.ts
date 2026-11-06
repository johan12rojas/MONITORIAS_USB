import { PrismaClient, Role, MonitorStatus, SessionStatus, SessionSource } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos semilla (Seed) de la Universidad Simón Bolívar...');

  // 1. Limpiar datos existentes
  await prisma.sessionAttendee.deleteMany();
  await prisma.monitoringSession.deleteMany();
  await prisma.monitorProfile.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.academicPeriod.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  const defaultPassword = await bcrypt.hash('Monitor2026*', 10);

  // 2. Crear Periodo Académico
  const period = await prisma.academicPeriod.create({
    data: {
      code: '2026-2',
      name: 'Periodo 2026 - Segundo Semestre',
      startDate: new Date('2026-08-01'),
      endDate: new Date('2026-12-15'),
      isCurrent: true,
    },
  });
  console.log(`✅ Periodo académico creado: ${period.code}`);

  // 3. Crear Asignaturas del Programa
  const subjectsData = [
    { code: 'SIS101', name: 'Algoritmos y Programación I' },
    { code: 'SIS202', name: 'Estructuras de Datos' },
    { code: 'SIS303', name: 'Bases de Datos I' },
    { code: 'SIS404', name: 'Programación Web y Móvil' },
    { code: 'SIS505', name: 'Arquitectura de Software' },
    { code: 'SIS606', name: 'Sistemas Operativos' },
    { code: 'MAT101', name: 'Cálculo Diferencial' },
  ];

  const subjects = [];
  for (const s of subjectsData) {
    const subject = await prisma.subject.create({ data: { ...s, program: 'Ingeniería de Sistemas' } });
    subjects.push(subject);
  }
  console.log(`✅ ${subjects.length} asignaturas registradas.`);

  // 4. Crear Usuarios Directivos (Director y Coordinador)
  const director = await prisma.user.create({
    data: {
      email: 'jover.cabrales@unisimon.edu.co',
      passwordHash: defaultPassword,
      fullName: 'Jover Alonso Cabrales',
      institutionalCode: 'DOC-1001',
      role: Role.DIRECTOR,
    },
  });

  const coordinador = await prisma.user.create({
    data: {
      email: 'coordinacion.sistemas@unisimon.edu.co',
      passwordHash: defaultPassword,
      fullName: 'Coordinador Académico de Sistemas',
      institutionalCode: 'DOC-1002',
      role: Role.COORDINADOR,
    },
  });
  console.log(`✅ Director y Coordinador registrados.`);

  // 5. Crear el Monitor Autor del Proyecto (Johan Sebastian Rojas Gómez - MONITOR18)
  const authorUser = await prisma.user.create({
    data: {
      email: 'j_rojas20@unisimon.edu.co',
      passwordHash: defaultPassword,
      fullName: 'Johan Sebastian Rojas Gómez',
      institutionalCode: 'MONITOR18',
      role: Role.MONITOR,
    },
  });

  const authorProfile = await prisma.monitorProfile.create({
    data: {
      userId: authorUser.id,
      academicPeriodId: period.id,
      targetHours: 54.0,
      status: MonitorStatus.ACTIVO,
    },
  });

  // Sesiones iniciales del Monitor Autor (acumulando 38 horas hacia las 54h)
  const sampleSessions = [
    {
      date: new Date('2026-09-05'),
      startTime: '14:00',
      endTime: '16:00',
      hours: 2.0,
      type: 'Taller',
      topic: 'Consultas SQL Avanzadas y Agrupamientos',
      obs: 'Resolución de casos de estudio sobre normalización.',
      attendees: [
        { card: '1090111222', name: 'Brayhan Alejandro Gómez Vega', career: 'Ing. Sistemas' },
        { card: '1090333444', name: 'Valeria Barbosa', career: 'Ing. Sistemas' },
      ],
    },
    {
      date: new Date('2026-09-12'),
      startTime: '08:00',
      endTime: '12:00',
      hours: 4.0,
      type: 'Presencial',
      topic: 'Árboles Binarios de Búsqueda y AVL',
      obs: 'Implementación paso a paso de balanceo de nodos en C++.',
      attendees: [
        { card: '1090555666', name: 'Juan Pablo Monitorias', career: 'Ing. Sistemas' },
        { card: '1090777888', name: 'Carlos Mario Peña', career: 'Ing. Sistemas' },
        { card: '1090999000', name: 'Diana Marcela Torres', career: 'Ing. Multimedia' },
      ],
    },
    {
      date: new Date('2026-09-18'),
      startTime: '16:00',
      endTime: '18:00',
      hours: 2.0,
      type: 'Virtual',
      topic: 'React Hooks y Arquitectura de Componentes',
      obs: 'Sesión grabada en Teams sobre useState y useEffect.',
      recordingUrl: 'https://teams.microsoft.com/recordings/sesion-react-2026',
      attendees: [
        { card: '1090111222', name: 'Brayhan Alejandro Gómez Vega', career: 'Ing. Sistemas' },
      ],
    },
  ];

  for (const s of sampleSessions) {
    await prisma.monitoringSession.create({
      data: {
        monitorProfileId: authorProfile.id,
        academicPeriodId: period.id,
        subjectId: subjects[1].id,
        sessionDate: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        calculatedHours: s.hours,
        sessionType: s.type,
        topic: s.topic,
        recordingUrl: s.recordingUrl,
        observation: s.obs,
        status: SessionStatus.APROBADO,
        source: SessionSource.DIRECT,
        attendees: {
          create: s.attendees.map((a) => ({
            studentIdCard: a.card,
            studentName: a.name,
            careerProgram: a.career,
          })),
        },
      },
    });
  }

  // 6. Cargar los otros 19 Monitores del Caso de Negocio (Pág. 4: MONITOR1, MONITOR2, MONITOR14, etc.)
  const monitorsSummary = [
    { code: 'MONITOR1', hours: 36, students: 17 },
    { code: 'MONITOR2', hours: 40, students: 8 },
    { code: 'MONITOR10', hours: 3, students: 2 },
    { code: 'MONITOR11', hours: 99, students: 38 },
    { code: 'MONITOR14', hours: 246, students: 135 },
    { code: 'MONITOR20', hours: 96, students: 44 },
    { code: 'MONITOR21', hours: 10, students: 5 },
    { code: 'MONITOR26', hours: 85, students: 27 },
    { code: 'MONITOR27', hours: 71, students: 37 },
    { code: 'MONITOR29', hours: 10, students: 3 },
    { code: 'MONITOR32', hours: 2, students: 1 },
    { code: 'MONITOR3', hours: 25, students: 12 },
    { code: 'MONITOR4', hours: 54, students: 22 },
    { code: 'MONITOR5', hours: 55, students: 20 },
    { code: 'MONITOR6', hours: 18, students: 9 },
    { code: 'MONITOR7', hours: 48, students: 15 },
    { code: 'MONITOR8', hours: 12, students: 6 },
    { code: 'MONITOR9', hours: 30, students: 14 },
    { code: 'MONITOR12', hours: 54, students: 25 },
  ];

  for (const m of monitorsSummary) {
    const user = await prisma.user.create({
      data: {
        email: `${m.code.toLowerCase()}@unisimon.edu.co`,
        passwordHash: defaultPassword,
        fullName: `Estudiante ${m.code}`,
        institutionalCode: m.code,
        role: Role.MONITOR,
      },
    });

    const prof = await prisma.monitorProfile.create({
      data: {
        userId: user.id,
        academicPeriodId: period.id,
        targetHours: 54.0,
        status: m.hours >= 54 ? MonitorStatus.CUMPLIDO : MonitorStatus.ACTIVO,
      },
    });

    // Crear sesión acumulada de prueba
    await prisma.monitoringSession.create({
      data: {
        monitorProfileId: prof.id,
        academicPeriodId: period.id,
        subjectId: subjects[0].id,
        sessionDate: new Date('2026-09-01'),
        startTime: '08:00',
        endTime: '12:00',
        calculatedHours: m.hours,
        sessionType: 'Presencial',
        topic: `Consolidado Histórico de Monitorías ${m.code}`,
        observation: `Carga automática de horas acumuladas desde la matriz histórica SIA.`,
        status: SessionStatus.APROBADO,
        source: SessionSource.SIA_IMPORT,
      },
    });
  }

  console.log(`✅ 20 Monitores registrados con su historial exacto del documento de tesis.`);
  console.log('🚀 Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
