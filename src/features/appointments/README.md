# Feature: Appointments (Gestión de Turnos Médicos)

## Descripción General

El módulo de **Appointments** gestiona el sistema completo de turnos médicos de la aplicación. Proporciona funcionalidades para crear, editar, eliminar y filtrar citas médicas, con un sistema de formulario multi-paso, validación de horarios, y estado automático basado en la fecha.

## Estructura del Módulo

```
src/features/appointments/
├── components/
│   ├── AppointmentCard.tsx              # Tarjeta de cita con diseño profesional
│   ├── AppointmentSummaryCard.tsx       # Resumen de cita en formulario
│   ├── DatePickerField.tsx              # Campo selector de fecha
│   ├── DoctorSelector.tsx               # Selector de profesional
│   ├── FilterChips.tsx                  # Chips de filtrado por estado
│   ├── StatusSelector.tsx               # Selector de estado
│   ├── TimePickerField.tsx              # Campo selector de hora
│   ├── TimeSlotPeriodSelector.tsx       # Selector de período (mañana/tarde)
│   └── index.ts
├── hooks/
│   ├── useAppointments.ts               # Hook principal para CRUD
│   ├── useAppointmentActions.ts         # Acciones (editar, eliminar, crear)
│   ├── useAppointmentCard.ts            # Lógica de formateo para tarjetas
│   ├── useAppointmentMultiStepForm.ts   # Formulario multi-paso
│   ├── useAppointmentsFilter.ts         # Filtrado y auto-completado
│   └── index.ts
├── services/
│   ├── appointmentsService.ts           # API client
│   └── index.ts
├── types/
│   ├── appointment.types.ts             # Tipos TypeScript
│   └── index.ts
└── README.md                            # Este archivo
```

## Tipos TypeScript

### AppointmentStatus

```typescript
type AppointmentStatus = "scheduled" | "completed" | "cancelled";
```

Estados de las citas:
- **`scheduled`**: Cita programada (pendiente)
- **`completed`**: Cita completada
- **`cancelled`**: Cita cancelada

### Appointment

```typescript
interface Appointment {
  id: string;
  patient: string;        // Nombre del paciente
  doctor: string;         // Nombre del doctor
  date: string;           // Fecha en formato DD/MM/YYYY o YYYY-MM-DD
  time: string;           // Hora en formato HH:MM
  phone: string;          // Teléfono del paciente
  email: string;          // Email del paciente
  observations?: string;  // Observaciones opcionales
  status: AppointmentStatus;
}
```

### AppointmentFormData

```typescript
interface AppointmentFormData {
  patient: string;
  doctor: string;
  date: string;
  time: string;
  phone: string;
  email: string;
  observations?: string;
  status: AppointmentStatus;
}
```

## Componentes

### AppointmentCard

Tarjeta con diseño profesional para mostrar una cita médica.

**Props:**

```typescript
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}
```

**Características:**

- Diseño adaptativo con tema claro/oscuro
- Barra de estado superior con código de color
- Avatar del paciente con ícono
- Nombre del doctor con ícono médico
- Badge de estado (Programado, Completado, Cancelado)
- Fecha con día de la semana (Lun, Mar, etc.)
- Hora con íconos
- Observaciones expandibles (si existen)
- Botón "Editar" solo para citas programadas
- Botón "Eliminar" siempre disponible
- Truncamiento de texto para evitar superposición
- Sombras específicas por plataforma
- **Separación de responsabilidades**: Toda la lógica está en `useAppointmentCard` hook

**Ejemplo de uso:**

```typescript
import { AppointmentCard } from '@features/appointments';
import { useAppointmentActions } from '@features/appointments/hooks';

function ListaDeCitas() {
  const { handleEdit, handleDelete } = useAppointmentActions();
  const { deleteAppointment } = useAppointments();

  return (
    <AppointmentCard
      appointment={{
        id: "1",
        patient: "Juan Pérez",
        doctor: "Dr. Álvaro Medina",
        date: "25/10/2025",
        time: "10:30",
        phone: "+54 9 11 1234-5678",
        email: "juan@example.com",
        observations: "Primera consulta",
        status: "scheduled",
      }}
      onEdit={handleEdit}
      onDelete={(id) => handleDelete(id, deleteAppointment)}
    />
  );
}
```

### FilterChips

Chips de filtrado por estado de citas.

**Props:**

```typescript
interface FilterChipsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  filters: FilterType[];
  getFilterLabel: (filter: FilterType) => string;
  getFilterIcon: (filter: FilterType) => string;
}
```

**Ejemplo de uso:**

```typescript
import { FilterChips } from '@features/appointments';
import { useAppointmentsFilter } from '@features/appointments/hooks';

function PantallaCitas() {
  const {
    selectedFilter,
    setSelectedFilter,
    filters,
    getFilterLabel,
    getFilterIcon,
  } = useAppointmentsFilter(appointments);

  return (
    <FilterChips
      selectedFilter={selectedFilter}
      onFilterChange={setSelectedFilter}
      filters={filters}
      getFilterLabel={getFilterLabel}
      getFilterIcon={getFilterIcon}
    />
  );
}
```

### DoctorSelector

Selector de profesional médico con tarjetas visuales.

**Props:**

```typescript
interface DoctorSelectorProps {
  doctors: { id: string; name: string }[];
  selectedDoctor: string;
  onSelectDoctor: (doctorId: string) => void;
}
```

**Ejemplo de uso:**

```typescript
import { DoctorSelector } from '@features/appointments';

function SeleccionarDoctor() {
  const { availableDoctors, selectedDoctor, setSelectedDoctor } =
    useAppointmentMultiStepForm();

  return (
    <DoctorSelector
      doctors={availableDoctors}
      selectedDoctor={selectedDoctor}
      onSelectDoctor={setSelectedDoctor}
    />
  );
}
```

### TimeSlotPeriodSelector

Selector de período de horario (mañana o tarde).

**Props:**

```typescript
interface TimeSlotPeriodSelectorProps {
  selectedPeriod: 'morning' | 'afternoon' | null;
  onSelectPeriod: (period: 'morning' | 'afternoon') => void;
}
```

**Horarios disponibles:**
- **Mañana**: 09:00 - 13:00
- **Tarde**: 17:00 - 21:00

**Ejemplo de uso:**

```typescript
import { TimeSlotPeriodSelector } from '@features/appointments';

function SeleccionarHorario() {
  const { selectedTimeSlotPeriod, setSelectedTimeSlotPeriod } =
    useAppointmentMultiStepForm();

  return (
    <TimeSlotPeriodSelector
      selectedPeriod={selectedTimeSlotPeriod}
      onSelectPeriod={setSelectedTimeSlotPeriod}
    />
  );
}
```

## Hooks

### useAppointments

Hook principal para operaciones CRUD de citas médicas.

**Retorno:**

```typescript
{
  appointments: Appointment[];           // Lista de todas las citas
  isLoading: boolean;                    // Cargando citas
  isError: boolean;                      // Error al cargar
  error: Error | null;                   // Detalle del error
  refetch: () => void;                   // Recargar citas

  createAppointment: (data: AppointmentFormData) => Promise<Appointment>;
  updateAppointment: (params: { id: string; data: Partial<AppointmentFormData> }) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;

  isCreating: boolean;                   // Creando cita
  isUpdating: boolean;                   // Actualizando cita
  isDeleting: boolean;                   // Eliminando cita
}
```

**Ejemplo de uso básico:**

```typescript
import { useAppointments } from '@features/appointments/hooks';

function ListaCitas() {
  const {
    appointments,
    isLoading,
    createAppointment,
    deleteAppointment,
  } = useAppointments();

  const handleCreate = async () => {
    await createAppointment({
      patient: "María González",
      doctor: "Dra. María Hookerman",
      date: "26/10/2025",
      time: "15:30",
      phone: "+54 9 11 9876-5432",
      email: "maria@example.com",
      observations: "Control mensual",
      status: "scheduled",
    });
  };

  if (isLoading) return <Text>Cargando...</Text>;

  return (
    <FlatList
      data={appointments}
      renderItem={({ item }) => (
        <AppointmentCard
          appointment={item}
          onEdit={handleEdit}
          onDelete={(id) => deleteAppointment(id)}
        />
      )}
    />
  );
}
```

**Ejemplo: Actualizar estado de una cita:**

```typescript
const { updateAppointment } = useAppointments();

const marcarComoCompletada = async (appointmentId: string) => {
  await updateAppointment({
    id: appointmentId,
    data: { status: "completed" },
  });
};
```

### useAppointmentCard

Hook que encapsula toda la lógica de formateo y estado para las tarjetas de citas.

**Parámetros:**

```typescript
appointment: Appointment  // La cita a procesar
```

**Retorno:**

```typescript
{
  statusConfig: {
    text: string;      // Texto del estado ("Programado", "Completado", "Cancelado")
    color: string;     // Color hexadecimal del estado
    icon: string;      // Nombre del ícono Material Icons
  };
  dayName: string;          // Nombre corto del día ("Lun", "Mar", etc.)
  formattedDate: string;    // Fecha formateada en DD/MM/YYYY
  canEdit: boolean;         // Si la cita puede ser editada
  isCompleted: boolean;     // Si la cita está completada
  isCancelled: boolean;     // Si la cita está cancelada
}
```

**Características:**

- Formatea fechas desde YYYY-MM-DD a DD/MM/YYYY
- Calcula el nombre del día de la semana en español
- Determina la configuración visual según el estado
- Aplica reglas de negocio (ej: citas completadas no se pueden editar)
- Usa `useMemo` para optimizar el rendimiento

**Ejemplo de uso:**

```typescript
import { useAppointmentCard } from '@features/appointments/hooks';
import { useTheme } from '@features/settings';

function MiTarjetaCita({ appointment }: { appointment: Appointment }) {
  const { theme } = useTheme();
  const { statusConfig, dayName, formattedDate, canEdit } = useAppointmentCard(appointment);

  return (
    <View>
      {/* Badge de estado */}
      <View style={{ backgroundColor: statusConfig.color }}>
        <Text style={{ color: '#FFF' }}>
          {statusConfig.text}
        </Text>
      </View>

      {/* Fecha formateada */}
      <Text>{formattedDate}</Text>
      <Text>{dayName}</Text>

      {/* Botón editar (solo si se puede) */}
      {canEdit && (
        <Button title="Editar" onPress={handleEdit} />
      )}
    </View>
  );
}
```

**Ejemplo: Reutilizar en resumen de cita:**

```typescript
import { useAppointmentCard } from '@features/appointments/hooks';

function ResumenCita({ appointment }: { appointment: Appointment }) {
  const { statusConfig, formattedDate } = useAppointmentCard(appointment);

  return (
    <View>
      <Text>Fecha: {formattedDate}</Text>
      <Text style={{ color: statusConfig.color }}>
        Estado: {statusConfig.text}
      </Text>
    </View>
  );
}
```

**Reglas de negocio implementadas:**

```typescript
// Una cita NO puede editarse si:
// - Está completada (status === "completed")
// - Está cancelada (status === "cancelled")
const canEdit = !isCompleted && !isCancelled;
```

### useAppointmentActions

Hook para acciones de navegación (crear, editar, eliminar).

**Retorno:**

```typescript
{
  handleEdit: (appointment: Appointment) => void;
  handleDelete: (id: string, deleteFn: (id: string) => Promise<void>) => Promise<void>;
  handleCreate: () => void;
}
```

**Ejemplo de uso:**

```typescript
import { useAppointmentActions } from '@features/appointments/hooks';
import { useAppointments } from '@features/appointments/hooks';

function GestionCitas() {
  const { handleEdit, handleDelete, handleCreate } = useAppointmentActions();
  const { deleteAppointment } = useAppointments();

  return (
    <View>
      <Button title="Nueva Cita" onPress={handleCreate} />
      {appointments.map(apt => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          onEdit={handleEdit}
          onDelete={(id) => handleDelete(id, deleteAppointment)}
        />
      ))}
    </View>
  );
}
```

**Características:**

- `handleEdit`: Navega al formulario con datos pre-cargados
- `handleDelete`: Muestra confirmación antes de eliminar
- `handleCreate`: Navega al formulario vacío

### useAppointmentMultiStepForm

Hook completo para formulario multi-paso de citas.

**Retorno:**

```typescript
{
  // React Hook Form
  control: any;
  errors: any;
  handleSubmit: any;

  // Pasos del formulario
  currentStep: 'datetime' | 'doctor' | 'patient';
  isFirstStep: boolean;
  isLastStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Fecha y hora
  showDatePicker: boolean;
  showTimePicker: boolean;
  selectedDate: Date;
  selectedTime: Date;
  setShowDatePicker: (show: boolean) => void;
  setShowTimePicker: (show: boolean) => void;
  onDateChange: (event: any, date?: Date) => void;
  onTimeChange: (event: any, time?: Date) => void;
  availableTimeSlots: string[];
  selectedTimeSlotPeriod: 'morning' | 'afternoon' | null;
  setSelectedTimeSlotPeriod: (period: TimeSlotPeriod) => void;

  // Doctores
  availableDoctors: { id: string; name: string }[];
  selectedDoctor: string;
  setSelectedDoctor: (doctor: string) => void;

  // Submit
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  isLoading: boolean;

  // Navegación
  goBack: () => void;
}
```

**Pasos del formulario:**

1. **datetime**: Selección de fecha y horario
2. **doctor**: Selección de profesional
3. **patient**: Datos del paciente y confirmación

**Ejemplo de uso completo:**

```typescript
import { useAppointmentMultiStepForm } from '@features/appointments/hooks';
import { Controller } from 'react-hook-form';

function FormularioCita() {
  const {
    control,
    errors,
    handleSubmit,
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goBack,
    onSubmit,
    isLoading,
    // Paso 1: Fecha/Hora
    selectedDate,
    onDateChange,
    availableTimeSlots,
    selectedTimeSlotPeriod,
    setSelectedTimeSlotPeriod,
    // Paso 2: Doctor
    availableDoctors,
    selectedDoctor,
    setSelectedDoctor,
  } = useAppointmentMultiStepForm();

  if (currentStep === 'datetime') {
    return (
      <View>
        <DatePicker
          value={selectedDate}
          onChange={onDateChange}
        />
        <TimeSlotPeriodSelector
          selectedPeriod={selectedTimeSlotPeriod}
          onSelectPeriod={setSelectedTimeSlotPeriod}
        />
        <TimeSlotSelector slots={availableTimeSlots} />
        <Button title="Siguiente" onPress={goToNextStep} />
      </View>
    );
  }

  if (currentStep === 'doctor') {
    return (
      <View>
        <DoctorSelector
          doctors={availableDoctors}
          selectedDoctor={selectedDoctor}
          onSelectDoctor={setSelectedDoctor}
        />
        <Button title="Atrás" onPress={goBack} />
        <Button title="Siguiente" onPress={goToNextStep} />
      </View>
    );
  }

  if (currentStep === 'patient') {
    return (
      <View>
        <Controller
          control={control}
          name="patient"
          render={({ field }) => (
            <TextInput
              placeholder="Nombre del paciente"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <TextInput
              placeholder="Teléfono"
              value={field.value}
              onChangeText={field.onChange}
            />
          )}
        />
        <Button
          title={isLoading ? "Guardando..." : "Confirmar"}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        />
      </View>
    );
  }
}
```

**Características especiales:**

- **Validación de fecha**: No permite fechas pasadas
- **Filtro de horarios**: Oculta horarios pasados si es hoy
- **Zona horaria**: GMT-3 (Argentina)
- **Modo edición**: Pre-carga datos si se pasa `id` por parámetro
- **Auto-navegación**: Vuelve a la lista tras crear/editar

### useAppointmentsFilter

Hook para filtrar citas por estado y auto-completar citas pasadas.

**Retorno:**

```typescript
{
  selectedFilter: FilterType;                      // Filtro actual
  setSelectedFilter: (filter: FilterType) => void; // Cambiar filtro
  filteredAppointments: Appointment[];             // Citas filtradas
  getFilterLabel: (filter: FilterType) => string;  // Label del filtro
  getFilterIcon: (filter: FilterType) => string;   // Ícono del filtro
  filters: FilterType[];                           // Todos los filtros
}
```

**FilterType:**

```typescript
type FilterType = 'all' | 'scheduled' | 'completed' | 'cancelled';
```

**Ejemplo de uso:**

```typescript
import { useAppointments } from '@features/appointments/hooks';
import { useAppointmentsFilter } from '@features/appointments/hooks';

function CitasFiltradas() {
  const { appointments } = useAppointments();
  const {
    selectedFilter,
    setSelectedFilter,
    filteredAppointments,
    getFilterLabel,
    getFilterIcon,
    filters,
  } = useAppointmentsFilter(appointments);

  return (
    <View>
      {/* Chips de filtrado */}
      <ScrollView horizontal>
        {filters.map(filter => (
          <Chip
            key={filter}
            label={getFilterLabel(filter)}
            icon={getFilterIcon(filter)}
            selected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter)}
          />
        ))}
      </ScrollView>

      {/* Lista filtrada */}
      <FlatList
        data={filteredAppointments}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
      />
    </View>
  );
}
```

**Auto-completado de citas:**

El hook automáticamente marca citas como "completadas" si:
- El estado actual es "scheduled"
- La fecha y hora ya pasaron (zona GMT-3)

```typescript
// Ejemplo: Cita de ayer a las 10:00 AM
// Estado actual: "scheduled"
// Estado procesado: "completed" (automático)
```

## Servicios API

### appointmentsAPI

Cliente API para operaciones CRUD con el backend.

**Métodos:**

```typescript
{
  getAll: () => Promise<Appointment[]>;
  getById: (id: string) => Promise<Appointment>;
  create: (data: AppointmentFormData) => Promise<Appointment>;
  update: (id: string, data: Partial<AppointmentFormData>) => Promise<Appointment>;
  delete: (id: string) => Promise<void>;
}
```

**Sanitización automática:**

Todos los métodos sanitizan las respuestas del API para garantizar tipos correctos:

```typescript
export function sanitizeAppointment(data: any): Appointment {
  return {
    id: data.id || "",
    patient: data.patient || "",
    doctor: data.doctor || "",
    date: data.date || "",
    time: data.time || "",
    phone: data.phone || "",
    email: data.email || "",
    observations: data.observations || "",
    status: isValidStatus(data.status) ? data.status : "scheduled",
  };
}
```

**Ejemplo de uso directo:**

```typescript
import { appointmentsAPI } from '@features/appointments/services';

async function obtenerCitas() {
  try {
    const citas = await appointmentsAPI.getAll();
    console.log('Citas:', citas);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

**Nota:** En la mayoría de casos, usa `useAppointments` en lugar de llamar directamente al API.

## Ejemplos Prácticos

### Ejemplo 1: Pantalla de Lista de Citas

```typescript
import { useAppointments } from '@features/appointments/hooks';
import { useAppointmentsFilter } from '@features/appointments/hooks';
import { useAppointmentActions } from '@features/appointments/hooks';
import { AppointmentCard, FilterChips } from '@features/appointments';
import { ThemedView } from '@shared';

function PantallaCitas() {
  const { appointments, isLoading, deleteAppointment } = useAppointments();
  const {
    selectedFilter,
    setSelectedFilter,
    filteredAppointments,
    getFilterLabel,
    getFilterIcon,
    filters,
  } = useAppointmentsFilter(appointments);
  const { handleEdit, handleDelete, handleCreate } = useAppointmentActions();

  if (isLoading) {
    return (
      <ThemedView>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView>
      {/* Filtros */}
      <FilterChips
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        filters={filters}
        getFilterLabel={getFilterLabel}
        getFilterIcon={getFilterIcon}
      />

      {/* Lista de citas */}
      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, deleteAppointment)}
          />
        )}
        ListEmptyComponent={
          <Text>No hay citas {getFilterLabel(selectedFilter).toLowerCase()}</Text>
        }
      />

      {/* Botón flotante para crear */}
      <FAB onPress={handleCreate} icon="add" />
    </ThemedView>
  );
}
```

### Ejemplo 2: Formulario Multi-Paso Completo

```typescript
import { useAppointmentMultiStepForm } from '@features/appointments/hooks';
import {
  DatePickerField,
  TimeSlotPeriodSelector,
  DoctorSelector,
  AppointmentSummaryCard,
} from '@features/appointments';

function FormularioMultiPaso() {
  const form = useAppointmentMultiStepForm();

  return (
    <ThemedView>
      {/* Header con progreso */}
      <View style={styles.header}>
        <TouchableOpacity onPress={form.goBack}>
          <MaterialIcons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text>
          Paso {form.currentStep === 'datetime' ? 1 : form.currentStep === 'doctor' ? 2 : 3} de 3
        </Text>
      </View>

      {/* Paso 1: Fecha y Hora */}
      {form.currentStep === 'datetime' && (
        <View>
          <DatePickerField
            selectedDate={form.selectedDate}
            onDateChange={form.onDateChange}
          />
          <TimeSlotPeriodSelector
            selectedPeriod={form.selectedTimeSlotPeriod}
            onSelectPeriod={form.setSelectedTimeSlotPeriod}
          />
          {form.availableTimeSlots.map(slot => (
            <TimeSlotButton
              key={slot}
              time={slot}
              onPress={() => form.control.setValue('time', slot)}
            />
          ))}
          <Button title="Siguiente" onPress={form.goToNextStep} />
        </View>
      )}

      {/* Paso 2: Selección de Doctor */}
      {form.currentStep === 'doctor' && (
        <View>
          <DoctorSelector
            doctors={form.availableDoctors}
            selectedDoctor={form.selectedDoctor}
            onSelectDoctor={form.setSelectedDoctor}
          />
          <Button title="Siguiente" onPress={form.goToNextStep} />
        </View>
      )}

      {/* Paso 3: Datos del Paciente */}
      {form.currentStep === 'patient' && (
        <View>
          <Controller
            control={form.control}
            name="patient"
            rules={{ required: 'El nombre es requerido' }}
            render={({ field }) => (
              <TextInput
                placeholder="Nombre completo"
                value={field.value}
                onChangeText={field.onChange}
                error={form.errors.patient?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="phone"
            rules={{ required: 'El teléfono es requerido' }}
            render={({ field }) => (
              <TextInput
                placeholder="+54 9 11 1234-5678"
                value={field.value}
                onChangeText={field.onChange}
                keyboardType="phone-pad"
                error={form.errors.phone?.message}
              />
            )}
          />
          <Controller
            control={form.control}
            name="observations"
            render={({ field }) => (
              <TextInput
                placeholder="Observaciones (opcional)"
                value={field.value}
                onChangeText={field.onChange}
                multiline
                numberOfLines={4}
              />
            )}
          />
          <Button
            title={form.isLoading ? "Guardando..." : "Confirmar Cita"}
            onPress={form.handleSubmit(form.onSubmit)}
            disabled={form.isLoading}
          />
        </View>
      )}
    </ThemedView>
  );
}
```

### Ejemplo 3: Cambiar Estado de una Cita

```typescript
import { useAppointments } from '@features/appointments/hooks';
import { StatusSelector } from '@features/appointments';

function CambiarEstado({ appointmentId }: { appointmentId: string }) {
  const { updateAppointment } = useAppointments();
  const [status, setStatus] = useState<AppointmentStatus>('scheduled');

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    setStatus(newStatus);
    await updateAppointment({
      id: appointmentId,
      data: { status: newStatus },
    });
  };

  return (
    <StatusSelector
      selectedStatus={status}
      onSelectStatus={handleStatusChange}
    />
  );
}
```

### Ejemplo 4: Estadísticas de Citas

```typescript
import { useAppointments } from '@features/appointments/hooks';

function EstadisticasCitas() {
  const { appointments } = useAppointments();

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      programadas: appointments.filter(a => a.status === 'scheduled').length,
      completadas: appointments.filter(a => a.status === 'completed').length,
      canceladas: appointments.filter(a => a.status === 'cancelled').length,
    };
  }, [appointments]);

  return (
    <View>
      <StatCard label="Total" value={stats.total} color="#007AFF" />
      <StatCard label="Programadas" value={stats.programadas} color="#007AFF" />
      <StatCard label="Completadas" value={stats.completadas} color="#34C759" />
      <StatCard label="Canceladas" value={stats.canceladas} color="#FF3B30" />
    </View>
  );
}
```

### Ejemplo 5: Próximas Citas

```typescript
import { useAppointments } from '@features/appointments/hooks';

function ProximasCitas() {
  const { appointments } = useAppointments();

  const proximasCitas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return appointments
      .filter(apt => {
        if (apt.status !== 'scheduled') return false;

        // Parse date
        const [day, month, year] = apt.date.split('/').map(Number);
        const aptDate = new Date(year, month - 1, day);

        return aptDate >= hoy;
      })
      .sort((a, b) => {
        // Sort by date and time
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }

        // Si son el mismo día, ordenar por hora
        return a.time.localeCompare(b.time);
      })
      .slice(0, 5); // Primeras 5
  }, [appointments]);

  return (
    <View>
      <Text style={styles.title}>Próximas Citas</Text>
      {proximasCitas.map(apt => (
        <AppointmentCard
          key={apt.id}
          appointment={apt}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </View>
  );
}
```

## Buenas Prácticas

1. **Usa los hooks en lugar del API directamente**
   ```typescript
   // ✅ Correcto
   const { appointments, createAppointment } = useAppointments();

   // ❌ Evitar
   const appointments = await appointmentsAPI.getAll();
   ```

2. **Aprovecha el auto-completado de citas pasadas**
   ```typescript
   const { filteredAppointments } = useAppointmentsFilter(appointments);
   // Las citas pasadas ya están marcadas como "completed"
   ```

3. **Usa el hook de acciones para navegación**
   ```typescript
   const { handleEdit, handleDelete } = useAppointmentActions();
   // Maneja navegación y confirmaciones automáticamente
   ```

4. **Valida horarios en zona GMT-3**
   ```typescript
   // El hook ya maneja GMT-3 para validaciones
   const { availableTimeSlots } = useAppointmentMultiStepForm();
   // Horarios pasados ya están filtrados
   ```

5. **Maneja estados de carga**
   ```typescript
   const { isLoading, isCreating, isUpdating } = useAppointments();
   if (isLoading) return <LoadingSpinner />;
   ```

6. **Separa lógica de UI en componentes**
   ```typescript
   // ✅ Correcto - Lógica en hook, UI en componente
   function AppointmentCard({ appointment }) {
     const { statusConfig, formattedDate, canEdit } = useAppointmentCard(appointment);
     return <View>...</View>;
   }

   // ❌ Evitar - Lógica mezclada con UI
   function AppointmentCard({ appointment }) {
     const formatDate = (date) => { /* lógica aquí */ };
     const statusConfig = { /* lógica aquí */ };
     return <View>...</View>;
   }
   ```

## Integración con Otros Módulos

### Con Sistema de Temas

```typescript
import { useTheme } from '@features/settings';
import { AppointmentCard } from '@features/appointments';

function CitaConTema() {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <AppointmentCard appointment={apt} />
    </View>
  );
}
```

### Con Doctores

```typescript
import { useDoctors } from '@features/doctors/hooks';

// En el futuro, podrías integrar:
const { doctors } = useDoctors();
const doctorList = doctors.map(d => ({ id: d.id, name: d.name }));
```

## Dependencias

- **React Query (@tanstack/react-query)**: Gestión de estado del servidor y caché
- **React Hook Form**: Manejo de formularios y validaciones
- **Expo Router**: Navegación entre pantallas
- **Redux Toolkit**: Estado de autenticación (email del usuario)
- **@expo/vector-icons**: Íconos MaterialIcons

## API Endpoint

**Base URL**: Configurada en `@core/api/client`

**Endpoints:**
- `GET /appointments` - Obtener todas las citas
- `GET /appointments/:id` - Obtener una cita
- `POST /appointments` - Crear cita
- `PUT /appointments/:id` - Actualizar cita
- `DELETE /appointments/:id` - Eliminar cita

**Nota:** La aplicación usa MockAPI.io para desarrollo.

## Ver También

- [Sistema de Temas](../settings/README.md) - Integración con tema claro/oscuro
- [Feature de Doctors](../doctors/README.md) - Tarjetas de doctores
- [API Client](../../core/api/README.md) - Configuración del cliente HTTP
