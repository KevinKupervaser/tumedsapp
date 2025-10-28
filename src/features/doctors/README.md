# 👨‍⚕️ Feature: Doctors (Doctores)

Módulo de gestión y visualización de información de profesionales médicos en la aplicación de turnos médicos.

## 📁 Estructura del Módulo

```
doctors/
├── components/
│   ├── DoctorCard.tsx       # Componente de tarjeta de doctor
│   ├── ServiceCard.tsx      # Componente de tarjeta de servicio
│   └── index.ts             # Exportaciones de componentes
├── constants/
│   ├── doctors.data.ts      # Datos hardcodeados de doctores
│   ├── services.data.ts     # Datos hardcodeados de servicios
│   └── index.ts             # Exportaciones de constantes
├── types/
│   ├── doctor.types.ts      # Tipos TypeScript de doctores
│   ├── service.types.ts     # Tipos TypeScript de servicios
│   └── index.ts             # Exportaciones de tipos
├── index.ts                 # Exportaciones principales
└── README.md                # Este archivo
```

## 📋 Tipos de Datos

### `Doctor`

Interface que define la estructura de un profesional médico:

```typescript
interface Doctor {
  id: string;              // Identificador único del doctor
  name: string;            // Nombre completo (ej: "Dr. Álvaro Medina")
  specialty: string;       // Especialidad médica (ej: "Medicina General")
  experience: string;      // Años de experiencia (ej: "15 años de experiencia")
  education: string;       // Formación académica
  languages: string[];     // Idiomas que habla (ej: ["Español", "Inglés"])
  schedule: string;        // Horarios de atención
  bio: string;            // Biografía/descripción del profesional
  photo: any;             // Imagen del doctor (require de asset)
}
```

### `Service`

Interface que define la estructura de un servicio médico ofrecido por un doctor:

```typescript
interface Service {
  id: string;              // Identificador único del servicio
  doctorId: string;        // ID del doctor que ofrece el servicio
  doctorName: string;      // Nombre del doctor (ej: "Dr. Álvaro Medina")
  title: string;           // Título del servicio (ej: "Consulta General")
  description: string;     // Descripción detallada del servicio
  duration: string;        // Duración estimada (ej: "30 min")
  price: string;           // Precio del servicio (ej: "$5,000")
  icon: string;            // Nombre del icono MaterialIcons
}
```

## 🎨 Componentes

### `DoctorCard`

Componente visual que muestra la información completa de un doctor en formato de tarjeta colapsable.

#### Props

```typescript
interface DoctorCardProps {
  doctor: Doctor;  // Objeto con los datos del doctor
}
```

#### Características

- **Header Colapsable**: Muestra foto, nombre, especialidad y experiencia
- **Secciones Desplegables**:
  - 📝 **Sobre el profesional**: Biografía y descripción
  - 🎓 **Formación**: Educación y títulos
  - 🌍 **Idiomas**: Tags de idiomas que habla
  - 🕐 **Horarios de atención**: Disponibilidad

#### Estructura Visual

```
┌─────────────────────────────────────┐
│  [📷]  Dr. Álvaro Medina           │ ← Header (siempre visible)
│        Medicina General             │
│        15 años de experiencia       │
├─────────────────────────────────────┤
│  ℹ️  Sobre el profesional          │ ← Secciones colapsables
│      Especialista en medicina...    │
│                                     │
│  🎓  Formación                      │
│      Universidad Nacional...        │
│                                     │
│  🌍  Idiomas                        │
│      [Español] [Inglés]            │
│                                     │
│  🕐  Horarios de atención           │
│      Lunes a Viernes: 9:00-13:00   │
└─────────────────────────────────────┘
```

### `ServiceCard`

Componente visual que muestra un servicio médico con botón para agendar turno.

#### Props

```typescript
interface ServiceCardProps {
  service: Service;                    // Objeto con los datos del servicio
  onBook: (service: Service) => void;  // Callback cuando se presiona "Agendar"
}
```

#### Características

- **Header con Icono**: Icono Material y título del servicio
- **Información del Doctor**: Nombre del profesional
- **Descripción**: Detalle del servicio ofrecido
- **Metadata**: Duración y precio
- **Botón de Acción**: "Agendar" con navegación al formulario

#### Estructura Visual

```
┌─────────────────────────────────────┐
│  [🏥]  Consulta General            │ ← Icono y título
│         Dr. Álvaro Medina           │ ← Doctor
│                                     │
│  Consulta médica general completa   │ ← Descripción
│  con revisión integral...           │
│                                     │
│  🕐 30 min    💰 $5,000            │ ← Duración y precio
│                                     │
│  ┌─────────────────────────────┐   │
│  │    📅  Agendar              │   │ ← Botón de acción
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Ejemplo de Uso

```tsx
import { ServiceCard, SERVICES } from '@features/doctors';
import { useRouter } from 'expo-router';

function ServicesScreen() {
  const router = useRouter();

  const handleBookService = (service) => {
    router.push({
      pathname: '/(protected)/appointment-form',
      params: {
        doctorName: service.doctorName,
        serviceName: service.title,
      },
    });
  };

  return (
    <View>
      {SERVICES.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBook={handleBookService}
        />
      ))}
    </View>
  );
}
```

## 💾 Datos

### Doctores (`constants/doctors.data.ts`)

Los doctores están definidos en `constants/doctors.data.ts`:

```typescript
export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Álvaro Medina",
    specialty: "Medicina General",
    experience: "15 años de experiencia",
    education: "Universidad Nacional de Rosario - Medicina (2009)",
    languages: ["Español", "Inglés"],
    schedule: "Lunes a Viernes: 9:00 - 13:00 y 17:00 - 21:00",
    bio: "Especialista en medicina general...",
    photo: require("./../../../../assets/doctors/medina.jpg"),
  },
  // ... más doctores
];
```

### Servicios (`constants/services.data.ts`)

Los servicios médicos están definidos en `constants/services.data.ts`. Cada doctor tiene 2 servicios:

```typescript
export const SERVICES: Service[] = [
  // Dr. Álvaro Medina - Medicina General
  {
    id: "service-1",
    doctorId: "1",
    doctorName: "Dr. Álvaro Medina",
    title: "Consulta General",
    description: "Consulta médica general completa con revisión integral y diagnóstico",
    duration: "30 min",
    price: "$5,000",
    icon: "medical-services",
  },
  {
    id: "service-2",
    doctorId: "1",
    doctorName: "Dr. Álvaro Medina",
    title: "Control Preventivo",
    description: "Chequeo preventivo con análisis de signos vitales y recomendaciones",
    duration: "45 min",
    price: "$6,500",
    icon: "health-and-safety",
  },
  // Dra. María Hookerman - Cardiología
  {
    id: "service-3",
    doctorId: "2",
    doctorName: "Dra. María Hookerman",
    title: "Consulta Cardiológica",
    description: "Evaluación cardiovascular completa con electrocardiograma",
    duration: "45 min",
    price: "$8,000",
    icon: "favorite",
  },
  // ... más servicios
];
```

## 🔧 Uso

### Ejemplo 1: Lista de Servicios (Pantalla de Inicio)

```tsx
import { ServiceCard, SERVICES } from '@features/doctors';
import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';

function HomeScreen() {
  const router = useRouter();

  const handleBookService = (service) => {
    // Navegar al formulario con doctor pre-seleccionado
    router.push({
      pathname: '/(protected)/appointment-form',
      params: {
        doctorName: service.doctorName,
        serviceName: service.title,
      },
    });
  };

  return (
    <FlatList
      data={SERVICES}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ServiceCard service={item} onBook={handleBookService} />
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}
```

### Ejemplo 2: Lista de Doctores

```tsx
import { DoctorCard } from '@features/doctors';
import { DOCTORS } from '@features/doctors/constants';

function DoctorsScreen() {
  return (
    <View>
      {DOCTORS.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </View>
  );
}
```

### Ejemplo con un Doctor Específico

```tsx
import { DoctorCard, Doctor } from '@features/doctors';

function SingleDoctorView() {
  const doctor: Doctor = {
    id: "3",
    name: "Dr. Juan Pérez",
    specialty: "Pediatría",
    experience: "10 años de experiencia",
    education: "Universidad de Córdoba - Medicina (2014)",
    languages: ["Español"],
    schedule: "Lunes a Viernes: 8:00 - 12:00",
    bio: "Pediatra especializado en atención infantil...",
    photo: require("@/assets/doctors/perez.jpg"),
  };

  return <DoctorCard doctor={doctor} />;
}
```

### Ejemplo con FlatList

```tsx
import { FlatList } from 'react-native';
import { DoctorCard, DOCTORS } from '@features/doctors';

function DoctorsList() {
  return (
    <FlatList
      data={DOCTORS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DoctorCard doctor={item} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
```

### Ejemplo 5: Servicios Filtrados por Doctor

```tsx
import { useState } from 'react';
import { ServiceCard, SERVICES } from '@features/doctors';

function DoctorServices() {
  const [doctorId, setDoctorId] = useState("1");

  // Filtrar servicios por doctor
  const doctorServices = SERVICES.filter(
    (service) => service.doctorId === doctorId
  );

  return (
    <View>
      {doctorServices.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBook={handleBookService}
        />
      ))}
    </View>
  );
}
```

### Ejemplo 6: Filtrado por Especialidad

```tsx
import { useState } from 'react';
import { DoctorCard, DOCTORS } from '@features/doctors';

function FilteredDoctors() {
  const [specialty, setSpecialty] = useState("Medicina General");

  const filteredDoctors = DOCTORS.filter(
    (doctor) => doctor.specialty === specialty
  );

  return (
    <View>
      {filteredDoctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </View>
  );
}
```

## 🎨 Personalización

### Tema

El componente `DoctorCard` respeta el tema de la aplicación:

- Utiliza `useTheme()` para colores dinámicos
- Soporta modo claro y oscuro automáticamente
- Colores primarios para iconos y tags

### Estilos

Los estilos están definidos internamente en `DoctorCard.tsx`. Para personalizar:

1. **Avatar**: 60x60px, circular
2. **Tags de idiomas**: Fondo con opacidad del color primario (15%)
3. **Iconos**: 20px, color primario del tema
4. **Espaciado**: Consistente con el diseño de la app

## 📱 Dependencias

- `@shared/components/CollapsibleCard` - Contenedor colapsable
- `@shared/components/ThemedText` - Texto con tema
- `@features/settings/useTheme` - Hook de tema
- `@expo/vector-icons` - Iconos Material

## 🚀 Funcionalidades Implementadas

- [x] **Servicios Médicos**: Cada doctor ofrece servicios específicos
- [x] **ServiceCard Component**: Tarjetas visuales para servicios
- [x] **Navegación Pre-configurada**: Al agendar, el doctor se pre-selecciona
- [x] **Datos de Servicios**: Precios, duración, descripción
- [x] **Iconos Personalizados**: MaterialIcons para cada servicio

## 🚀 Funcionalidades Futuras

Posibles mejoras para este módulo:

- [ ] Integración con API real de doctores y servicios
- [ ] Sistema de búsqueda y filtros avanzados
- [ ] Calendario de disponibilidad interactivo
- [ ] Ratings y reseñas de pacientes
- [ ] Información de ubicación del consultorio
- [ ] Galería de certificaciones
- [ ] Promociones y descuentos en servicios
- [ ] Comparación de precios entre servicios
- [ ] Historial de servicios utilizados

## 📝 Notas

- **Datos estáticos**: Actualmente los doctores y servicios están hardcodeados
- **Imágenes**: Las fotos deben estar en `assets/doctors/`
- **Formato de horarios**: Usar formato legible (ej: "Lunes a Viernes: 9:00 - 13:00")
- **Biografía**: Recomendado máximo 2-3 líneas para mejor UX
- **Iconos de Servicios**: Usar nombres válidos de MaterialIcons
- **Precios**: Incluir símbolo de moneda (ej: "$5,000")
- **Navegación**: Los servicios navegan a `appointment-form` con params pre-configurados

## 🔗 Enlaces Relacionados

- [Componente CollapsibleCard](../../shared/components/animations/Collapsible.tsx)
- [Sistema de Temas](../settings/README.md)
- [Feature de Appointments](../appointments/README.md)

---

**Última actualización**: 2025-10-27
**Mantenido por**: Equipo de Desarrollo Vortex IT

## 📱 Integración con HomeScreen

La pantalla de inicio (`src/app/(protected)/(tabs)/index.tsx`) ahora muestra los servicios médicos en lugar de la lista de turnos. Cuando el usuario presiona "Agendar" en un servicio:

1. Se navega a `appointment-form`
2. El doctor se pre-selecciona automáticamente
3. El usuario solo debe elegir fecha/hora y completar sus datos
4. La lista original de turnos se guardó en `index-appointments-backup.tsx` para uso futuro
