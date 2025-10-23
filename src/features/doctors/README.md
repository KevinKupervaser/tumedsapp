# 👨‍⚕️ Feature: Doctors (Doctores)

Módulo de gestión y visualización de información de profesionales médicos en la aplicación de turnos médicos.

## 📁 Estructura del Módulo

```
doctors/
├── components/
│   ├── DoctorCard.tsx       # Componente de tarjeta de doctor
│   └── index.ts             # Exportaciones de componentes
├── constants/
│   ├── doctors.data.ts      # Datos hardcodeados de doctores
│   └── index.ts             # Exportaciones de constantes
├── types/
│   ├── doctor.types.ts      # Tipos TypeScript
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

## 💾 Datos

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

## 🔧 Uso

### Ejemplo Básico

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

### Ejemplo Filtrado por Especialidad

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

## 🚀 Funcionalidades Futuras

Posibles mejoras para este módulo:

- [ ] Integración con API real de doctores
- [ ] Sistema de búsqueda y filtros
- [ ] Calendario de disponibilidad interactivo
- [ ] Ratings y reseñas de pacientes
- [ ] Botón de "Agendar turno" directo
- [ ] Información de ubicación del consultorio
- [ ] Galería de certificaciones

## 📝 Notas

- **Datos estáticos**: Actualmente los doctores están hardcodeados en `doctors.data.ts`
- **Imágenes**: Las fotos deben estar en `assets/doctors/`
- **Formato de horarios**: Usar formato legible (ej: "Lunes a Viernes: 9:00 - 13:00")
- **Biografía**: Recomendado máximo 2-3 líneas para mejor UX

## 🔗 Enlaces Relacionados

- [Componente CollapsibleCard](../../shared/components/animations/Collapsible.tsx)
- [Sistema de Temas](../settings/README.md)
- [Feature de Appointments](../appointments/README.md)

---

**Última actualización**: 2025-10-23
**Mantenido por**: Equipo de Desarrollo Vortex IT
