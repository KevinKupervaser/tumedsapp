# 🏗️ Arquitectura del Proyecto - TurnosApp

> **Aplicación de gestión de turnos médicos construida con React Native, Expo y TypeScript**

Esta documentación describe la estructura del proyecto, patrones arquitectónicos y mejores prácticas implementadas siguiendo principios de Clean Architecture y Feature-Driven Development.

---

## 📑 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Capas de la Arquitectura](#capas-de-la-arquitectura)
4. [Módulos Principales](#módulos-principales)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Flujo de Datos](#flujo-de-datos)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Convenciones de Nomenclatura](#convenciones-de-nomenclatura)

---

## 🎯 Visión General

### Principios Arquitectónicos

La aplicación está construida siguiendo estos principios fundamentales:

- **🔹 Separation of Concerns (SoC)**: Cada módulo tiene una responsabilidad única y bien definida
- **🔹 Feature-Driven Development**: Organización por características de negocio, no por tipo técnico
- **🔹 DRY (Don't Repeat Yourself)**: Reutilización mediante componentes compartidos y hooks personalizados
- **🔹 SOLID Principles**: Especialmente Single Responsibility y Dependency Inversion
- **🔹 Composition over Inheritance**: Uso extensivo de hooks y composición de componentes

### Stack Tecnológico

```
- React Native 0.81.4
- Expo SDK 54
- TypeScript 5.9
- React Navigation (expo-router)
- Redux Toolkit (estado global)
- React Query (estado servidor)
- React Native Reanimated (animaciones)
- React Hook Form (formulario y validaciones)
```

---

## 📁 Estructura de Carpetas

```
src/
├── app/                    # 🚦 Routing y Navegación (Expo Router)
│   ├── (protected)/        # Rutas protegidas (requieren autenticación)
│   │   ├── (tabs)/        # Navegación por pestañas
│   │   └── *.tsx          # Pantallas modales y específicas
│   ├── (public)/          # Rutas públicas (login)
│   ├── _layout.tsx        # Layout raíz de la app
│   └── index.tsx          # Punto de entrada
│
├── core/                   # 🔧 Núcleo de la Aplicación
│   ├── api/               # Cliente HTTP y configuración de APIs
│   ├── config/            # Configuración global de la app
│   └── store/             # Store de Redux (configuración central)
│
├── features/              # 🎨 Módulos de Negocio (Feature Modules)
│   ├── appointments/      # Gestión de turnos médicos
│   ├── auth/              # Autenticación y autorización
│   ├── doctors/           # Información de profesionales y servicios
│   ├── location/          # Geolocalización y mapas
│   ├── offline/           # Sincronización offline
│   ├── profile/           # Perfil de usuario
│   └── settings/          # Configuración y preferencias (temas claro, oscuro y sistema)
│
└── shared/                # 🧩 Código Compartido
    ├── components/        # Componentes reutilizables
    ├── constants/         # Constantes globales
    ├── types/             # Tipos TypeScript compartidos
    └── utils/             # Utilidades y helpers
```

---

## 🏛️ Capas de la Arquitectura

### 1. **Capa de Presentación (UI Layer)** - `app/`

**Responsabilidad**: Navegación, routing y estructura de pantallas.

```
app/
├── (protected)/           # Grupo de rutas autenticadas
│   ├── (tabs)/           # Bottom tabs navigation
│   │   ├── index.tsx     # Home - Lista de servicios
│   │   ├── appointments.tsx  # Turnos - Lista de citas
│   │   ├── profile.tsx   # Perfil de usuario
│   │   ├── doctors.tsx   # Profesionales médicos
│   │   ├── settings.tsx  # Ajustes de la app
│   │   └── _layout.tsx   # Layout de tabs
│   ├── appointment-form.tsx  # Formulario multi-paso
│   └── _layout.tsx       # Layout protegido
├── (public)/
│   ├── login.tsx         # Pantalla de login
│   └── _layout.tsx       # Layout público
└── _layout.tsx           # Layout raíz (providers globales)
```

**Características clave**:
- Usa **Expo Router** (file-based routing)
- Grupos de rutas con paréntesis `(protected)`, `(tabs)`
- Layouts anidados para estructura jerárquica
- Separación clara entre rutas públicas y protegidas

**Ejemplo de uso**:
```tsx
// app/(protected)/(tabs)/index.tsx
import { SERVICES, ServiceCard } from "@features/doctors";

export default function HomeScreen() {
  return (
    <FlatList
      data={SERVICES}
      renderItem={({ item }) => <ServiceCard service={item} />}
    />
  );
}
```

---

### 2. **Capa de Negocio (Business Logic Layer)** - `features/`

**Responsabilidad**: Lógica de negocio, casos de uso y reglas del dominio.

Cada feature sigue una estructura modular consistente:

```
features/[feature-name]/
├── components/           # Componentes específicos del feature
│   ├── [Component].tsx
│   └── index.ts         # Barrel export
├── hooks/               # Custom hooks (lógica reutilizable)
│   ├── use[Feature].ts
│   └── index.ts
├── services/            # Comunicación con APIs
│   ├── [feature]Service.ts
│   └── index.ts
├── store/               # Estado local (Redux slice)
│   ├── [feature]Slice.ts
│   └── index.ts
├── types/               # Tipos TypeScript
│   ├── [feature].types.ts
│   └── index.ts
├── constants/           # Constantes del feature
│   └── index.ts
├── utils/               # Utilidades específicas
│   └── index.ts
├── index.ts             # Export público del feature
└── README.md            # Documentación del módulo
```

**Principio de Encapsulación**:
- Cada feature es **autónomo** y puede funcionar independientemente
- Exporta solo lo necesario mediante `index.ts` (public API)
- Oculta detalles de implementación
- Facilita testing unitario

**Ejemplo - Feature de Appointments**:
```
features/appointments/
├── components/
│   ├── AppointmentCard.tsx          # Tarjeta de turno
│   ├── AppointmentSummaryCard.tsx   # Resumen de cita
│   ├── DatePickerField.tsx          # Selector de fecha
│   ├── DoctorSelector.tsx           # Selector de doctor
│   ├── FilterChips.tsx              # Filtros de estado
│   └── TimePickerField.tsx          # Selector de hora
├── hooks/
│   ├── useAppointments.ts           # CRUD de turnos
│   ├── useAppointmentActions.ts     # Acciones de UI
│   ├── useAppointmentsFilter.ts     # Lógica de filtrado
│   ├── useAppointmentCard.ts        # Lógica de card
│   ├── useAppointmentMultiStepForm.ts  # Formulario multi-paso
│   └── useAppointmentFormFlow.ts    # Flujo de pasos
├── services/
│   └── appointmentsService.ts       # API endpoints
├── types/
│   └── appointments.types.ts        # Interfaces y tipos
├── utils/
│   └── doctorAvatarMap.ts          # Mapeo de avatares
└── README.md
```

---

### 3. **Capa de Infraestructura (Core Layer)** - `core/`

**Responsabilidad**: Configuración técnica, servicios de bajo nivel y utilidades globales.

```
core/
├── api/
│   ├── apiClient.ts      # Cliente Axios configurado
│   └── endpoints.ts      # URLs de endpoints
├── config/
│   └── queryClients.ts   # Configuración tanstack
└── store/
    ├── index.ts         # Store de Redux
    ├── rootReducer.ts   # Combinación de reducers
    └── hooks.ts         # Hooks tipados (useAppDispatch, useAppSelector)
```

**Responsabilidades del Core**:
- ✅ Configuración de clientes HTTP (Axios, React Query)
- ✅ Setup del store global (Redux Toolkit)
- ✅ Manejo de variables de entorno
- ✅ Interceptores de red (auth tokens, error handling)
- ✅ Configuración de persistencia (AsyncStorage)

**Ejemplo - API Client**:
```typescript
// core/api/apiClient.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 4. **Capa Compartida (Shared Layer)** - `shared/`

**Responsabilidad**: Componentes, utilidades y tipos reutilizables en toda la app.

```
shared/
├── components/
│   ├── animations/       # Componentes con animaciones
│   │   ├── Collapsible.tsx
│   │   └── FadeInView.tsx
│   ├── form/            # Componentes de formulario
│   │   ├── FormField.tsx
│   │   └── validation.ts
│   ├── layout/          # Layouts y containers
│   │   ├── SlideUpScreen.tsx
│   │   └── SafeAreaView.tsx
│   ├── Map/             # Componentes de mapas
│   │   └── MapView.tsx
│   ├── themed/          # Componentes con tema
│   │   ├── ThemedText.tsx
│   │   ├── ThemedView.tsx
│   │   └── ThemedButton.tsx
│   ├── ui/              # Componentes UI genéricos
│   │   ├── Button.tsx
│   │   ├── IconSymbol.tsx
│   │   ├── LogoutButton.tsx
│   │   └── HapticTab.tsx
│   └── index.ts
├── constants/
│   ├── theme.ts         # Colores y estilos del tema
│   └── index.ts
├── types/
│   ├── common.types.ts  # Tipos compartidos
│   └── index.ts
└── utils/
    ├── formatters.ts    # Formateadores (fechas, números)
    └── validators.ts    # Validaciones
```

**Principio de Reutilización**:
- Componentes **altamente reutilizables** sin lógica de negocio
- **Composables** y configurables via props
- Siguen el sistema de diseño de la app
- Testing exhaustivo (son la base de la UI)

**Ejemplo - ThemedText**:
```tsx
// shared/components/themed/ThemedText.tsx
import { Text, TextProps } from 'react-native';
import { useTheme } from '@features/settings';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const { theme } = useTheme();

  return (
    <Text
      style={[
        { color: theme.text },
        type === 'title' && styles.title,
        type === 'subtitle' && styles.subtitle,
        style,
      ]}
      {...rest}
    />
  );
}
```

---

## 🧩 Módulos Principales

### 📅 Appointments (Turnos Médicos)

**Ubicación**: `features/appointments/`

**Funcionalidades**:
- ✅ Crear, editar, eliminar turnos
- ✅ Formulario multi-paso (3 pasos: fecha/hora, doctor, paciente)
- ✅ Filtrado por estado (todos, programadas, completadas, canceladas)
- ✅ Tarjetas visuales con información del turno
- ✅ Integración con servicios médicos
- ✅ Selección dinámica de horarios (mañana/tarde)
- ✅ Pre-selección de doctor desde servicios

**Hooks principales**:
- `useAppointments()` - CRUD completo
- `useAppointmentMultiStepForm()` - Lógica del formulario
- `useAppointmentsFilter()` - Sistema de filtros
- `useAppointmentFormFlow()` - Navegación entre pasos

**Documentación**: [features/appointments/README.md](../features/appointments/README.md)

---

### 🔐 Auth (Autenticación)

**Ubicación**: `features/auth/`

**Funcionalidades**:
- ✅ Login con email/password
- ✅ Registro de nuevos usuarios
- ✅ Persistencia de sesión (Redux Persist)
- ✅ Protección de rutas
- ✅ Manejo de tokens JWT

**Estado Global**:
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

---

### 👨‍⚕️ Doctors (Profesionales y Servicios)

**Ubicación**: `features/doctors/`

**Funcionalidades**:
- ✅ Listado de profesionales médicos
- ✅ Información detallada (bio, formación, idiomas)
- ✅ Servicios ofrecidos por cada doctor
- ✅ Tarjetas de servicio con "Agendar"
- ✅ Navegación a formulario con doctor pre-seleccionado

**Componentes**:
- `DoctorCard` - Tarjeta expandible con info del doctor
- `ServiceCard` - Tarjeta de servicio médico

**Documentación**: [features/doctors/README.md](../features/doctors/README.md)

---

### 📍 Location (Geolocalización)

**Ubicación**: `features/location/`

**Funcionalidades**:
- ✅ Visualización de mapa
- ✅ Marcadores de ubicación
- ✅ Detección de ubicación actual
- ✅ Integración con Google Maps

---

### 📴 Offline (Sincronización)

**Ubicación**: `features/offline/`

**Funcionalidades**:
- ✅ Modo offline completo
- ✅ Guardado local con AsyncStorage
- ✅ Sincronización automática al reconectar
- ✅ Cola de operaciones pendientes
- ✅ Indicador visual de estado de sync
- ✅ Retry automático de fallos

**Servicios**:
- `OfflineService` - Gestión de AsyncStorage
- `SyncService` - Lógica de sincronización

**Hooks**:
- `useOfflineSync()` - Hook principal
- `useNetworkStatus()` - Detección de red

**Documentación**: [features/offline/README.md](../features/offline/README.md)

---

### 👤 Profile (Perfil de Usuario)

**Ubicación**: `features/profile/`

**Funcionalidades**:
- ✅ Visualización de perfil
- ✅ Edición de foto (cámara/galería)
- ✅ Gestión de datos personales

**Hooks**:
- `useProfilePictureManagement()` - Lógica de foto de perfil

---

### ⚙️ Settings (Configuración)

**Ubicación**: `features/settings/`

**Funcionalidades**:
- ✅ Tema de la app (light/dark/system)
- ✅ Preferencias de usuario
- ✅ Configuración global

**Estado**:
```typescript
interface ThemeState {
  mode: 'system' | 'light' | 'dark';
}
```

**Hook**:
- `useTheme()` - Acceso al tema actual

---

## 🎨 Patrones de Diseño

### 1. **Custom Hooks Pattern**

**Propósito**: Separar lógica de presentación (UI vs Business Logic)

**Ejemplo**:
```tsx
// ❌ MAL - Lógica mezclada con UI
function AppointmentCard({ appointment }) {
  const formatDate = (date) => { /* ... */ };
  const getDayName = (date) => { /* ... */ };
  const statusConfig = getStatusConfig(appointment.status);

  return <View>...</View>;
}

// ✅ BIEN - Lógica extraída a hook
function useAppointmentCard(appointment) {
  const statusConfig = useMemo(() => getStatusConfig(appointment.status), [appointment.status]);
  const dayName = useMemo(() => getDayName(appointment.date), [appointment.date]);
  const formattedDate = useMemo(() => formatDate(appointment.date), [appointment.date]);

  return { statusConfig, dayName, formattedDate };
}

function AppointmentCard({ appointment }) {
  const { statusConfig, dayName, formattedDate } = useAppointmentCard(appointment);

  return <View>...</View>;
}
```

**Ventajas**:
- ✅ Componente más limpio y legible
- ✅ Lógica reutilizable
- ✅ Fácil de testear
- ✅ Mejor performance con memoización

---

### 2. **Barrel Exports Pattern**

**Propósito**: API pública limpia para cada módulo

**Estructura**:
```typescript
// features/appointments/index.ts
export * from './components';
export * from './hooks';
export * from './types';

// Uso externo
import { AppointmentCard, useAppointments } from '@features/appointments';
```

**Ventajas**:
- ✅ Imports más limpios
- ✅ Encapsulación (solo exportas lo público)
- ✅ Fácil refactoring interno
- ✅ Tree-shaking optimizado

---

### 3. **Composition Pattern**

**Propósito**: Construir UIs complejas desde componentes simples

**Ejemplo**:
```tsx
// Componente base genérico
<ThemedView>
  <ThemedText type="title">Título</ThemedText>
  <ServiceCard service={service} onBook={handleBook} />
</ThemedView>

// Composición en pantallas
<HomeScreen>
  <Header>
    <ThemedText type="title">Servicios</ThemedText>
    <LogoutButton />
  </Header>
  <ServiceList />
</HomeScreen>
```

---

### 4. **Container/Presenter Pattern**

**Propósito**: Separar lógica (container) de presentación (presenter)

**Ejemplo**:
```tsx
// Container - Maneja estado y lógica
function AppointmentsContainer() {
  const { appointments, isLoading } = useAppointments();
  const { handleEdit, handleDelete } = useAppointmentActions();

  return (
    <AppointmentsList
      appointments={appointments}
      isLoading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}

// Presenter - Solo renderiza
function AppointmentsList({ appointments, isLoading, onEdit, onDelete }) {
  if (isLoading) return <Loader />;

  return (
    <FlatList
      data={appointments}
      renderItem={({ item }) => (
        <AppointmentCard
          appointment={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
}
```

---

### 5. **Service Layer Pattern**

**Propósito**: Centralizar llamadas a APIs

**Ejemplo**:
```typescript
// features/appointments/services/appointmentsService.ts
export const appointmentsService = {
  getAll: () => apiClient.get('/appointments'),
  getById: (id: string) => apiClient.get(`/appointments/${id}`),
  create: (data: AppointmentFormData) => apiClient.post('/appointments', data),
  update: (id: string, data: AppointmentFormData) =>
    apiClient.put(`/appointments/${id}`, data),
  delete: (id: string) => apiClient.delete(`/appointments/${id}`),
};

// Uso en hook
function useAppointments() {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentsService.getAll,
  });
}
```

---

## 🔄 Flujo de Datos

### Estado Local vs Global

```
┌─────────────────────────────────────────────────┐
│                ESTADO GLOBAL                     │
│              (Redux Toolkit)                     │
├─────────────────────────────────────────────────┤
│  • auth.user        (Usuario autenticado)       │
│  • auth.token       (JWT token)                 │
│  • theme.mode       (Tema: light/dark/system)   │
│  • settings.*       (Configuración global)      │
└─────────────────────────────────────────────────┘
                     ▲  ▼
                useAppSelector
                useAppDispatch
                     │
┌─────────────────────────────────────────────────┐
│            ESTADO DEL SERVIDOR                   │
│             (React Query)                        │
├─────────────────────────────────────────────────┤
│  • appointments     (Lista de turnos)           │
│  • doctors          (Profesionales)             │
│  • services         (Servicios médicos)         │
│                                                  │
│  Cache + Sincronización automática              │
└─────────────────────────────────────────────────┘
                     ▲  ▼
                  useQuery
                useMutation
                     │
┌─────────────────────────────────────────────────┐
│             ESTADO LOCAL                         │
│          (useState, useReducer)                  │
├─────────────────────────────────────────────────┤
│  • Form inputs      (Campos de formulario)      │
│  • UI state         (Modales, tabs, etc)        │
│  • Component state  (Expandido/colapsado)       │
└─────────────────────────────────────────────────┘
```

### Flujo de Creación de Turno

```
Usuario
  │
  ├─> 1. Hace clic en "Agendar" en ServiceCard
  │      └─> router.push() con params { doctorName, serviceName }
  │
  ├─> 2. Navega a appointment-form.tsx
  │      └─> useAppointmentMultiStepForm() detecta params.doctorName
  │      └─> Pre-selecciona doctor
  │      └─> Salta step 2 (doctor selection)
  │
  ├─> 3. Usuario completa Step 1: Fecha y Horario
  │      └─> DatePickerField + TimePickerField
  │      └─> Validación en tiempo real
  │
  ├─> 4. Usuario completa Step 3: Datos del Paciente
  │      └─> FormFields con validación (react-hook-form)
  │
  ├─> 5. Presiona "Confirmar Turno"
  │      └─> onSubmit() ejecuta appointmentsService.create()
  │      └─> useMutation invalida cache de React Query
  │      └─> Lista de turnos se actualiza automáticamente
  │
  └─> 6. Navega de vuelta (router.back())
       └─> Ve el turno creado en la lista
```

---

## ✅ Mejores Prácticas

### 1. **TypeScript Estricto**

```typescript
// ✅ Siempre tipar interfaces
interface Service {
  id: string;
  doctorId: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  icon: string;
}

// ✅ Tipar props de componentes
interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

// ❌ Evitar 'any'
const data: any = fetchData(); // MAL

// ✅ Usar tipos específicos o 'unknown'
const data: ServiceResponse = fetchData(); // BIEN
```

---

### 2. **Performance - Memoización**

```typescript
// ✅ Memoizar callbacks en FlatList
const renderItem = useCallback(
  ({ item }: { item: Service }) => (
    <ServiceCard service={item} onBook={handleBook} />
  ),
  [handleBook]
);

const keyExtractor = useCallback((item: Service) => item.id, []);

<FlatList
  data={services}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
/>

// ✅ Memoizar cálculos costosos
const filteredAppointments = useMemo(
  () => appointments.filter(apt => apt.status === selectedFilter),
  [appointments, selectedFilter]
);
```

---

### 3. **Animaciones Nativas**

```typescript
// ✅ Usar react-native-reanimated (60fps)
import Animated, { FadeInDown } from 'react-native-reanimated';

<Animated.View entering={FadeInDown.delay(index * 100)}>
  <ServiceCard service={item} />
</Animated.View>

// ❌ Evitar Animated API de React Native (JavaScript thread)
```

---

### 4. **Gestión de Errores**

```typescript
// ✅ Try-catch en operaciones async
async function handleSubmit(data: FormData) {
  try {
    await createAppointment(data);
    router.back();
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'No se pudo crear el turno');
  }
}

// ✅ Error boundaries para errores de renderizado
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

---

### 5. **Separación de Lógica**

```typescript
// ❌ MAL - Todo en el componente
function AppointmentForm() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState('');
  // 100+ líneas de lógica...

  return <View>...</View>;
}

// ✅ BIEN - Lógica en hooks
function useAppointmentMultiStepForm() {
  const [step, setStep] = useState(1);
  const goNext = () => setStep(s => s + 1);
  const goPrev = () => setStep(s => s - 1);
  // ...
  return { step, goNext, goPrev, ... };
}

function AppointmentForm() {
  const { step, goNext, goPrev } = useAppointmentMultiStepForm();
  return <View>...</View>;
}
```

---

### 6. **Documentación**

Cada feature debe tener su `README.md` con:
- ✅ Descripción del módulo
- ✅ Estructura de archivos
- ✅ Tipos TypeScript principales
- ✅ Componentes y hooks exportados
- ✅ Ejemplos de uso
- ✅ Dependencias

---

## 📝 Convenciones de Nomenclatura

### Archivos

```
PascalCase:
  - Componentes: AppointmentCard.tsx, ServiceCard.tsx
  - Pantallas: HomeScreen.tsx, LoginScreen.tsx

camelCase:
  - Hooks: useAppointments.ts, useTheme.ts
  - Services: appointmentsService.ts, authService.ts
  - Utils: formatters.ts, validators.ts

kebab-case:
  - Configuración: app.config.ts, tsconfig.json

Especiales:
  - README.md (siempre en mayúsculas)
  - index.ts (barrel exports)
  - _layout.tsx (Expo Router layouts)
```

### Variables y Funciones

```typescript
// camelCase para variables y funciones
const userName = 'Juan';
const handleSubmit = () => {};

// PascalCase para componentes y tipos
function ServiceCard() {}
interface ServiceCardProps {}

// UPPER_SNAKE_CASE para constantes
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Prefijos descriptivos
const isLoading = true;        // boolean
const hasError = false;        // boolean
const getUser = () => {};      // getter
const setUser = () => {};      // setter
const handleClick = () => {};  // event handler
const onSubmit = () => {};     // callback
```

### Hooks Personalizados

```typescript
// Siempre comenzar con 'use'
useAppointments()
useAuth()
useTheme()
useNetworkStatus()

// Naming pattern: use[Feature][Action/State]
useAppointmentMultiStepForm()
useAppointmentFormFlow()
useProfilePictureManagement()
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm start                  # Iniciar Expo
npm run android           # Abrir en Android
npm run ios               # Abrir en iOS

# Calidad de Código
npm run lint              # ESLint
npm run type-check        # TypeScript check
npm test                  # Tests

# Build
npm run build             # Build de producción
```

---

## 📚 Referencias

### Documentación Oficial
- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/latest)

---

## 👥 Contribución

### Agregar un Nuevo Feature

1. Crear carpeta en `features/[nombre-feature]/`
2. Seguir la estructura estándar:
   ```
   [feature]/
   ├── components/
   ├── hooks/
   ├── services/
   ├── types/
   ├── index.ts
   └── README.md
   ```
3. Documentar en README.md (en español)
4. Exportar API pública en index.ts
5. Actualizar este README principal

### Pull Request Checklist

- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Componentes con memoización (useCallback, useMemo)
- [ ] Documentación actualizada
- [ ] Ejemplos de uso en README
- [ ] Tests unitarios (si aplica)

---

**Última actualización**: 2025-10-28
**Mantenido por**: Equipo de Desarrollo Vortex IT
**Versión**: 1.0.0
