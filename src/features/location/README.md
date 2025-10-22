# 📍 Feature de Ubicación

Geolocalización del consultorio con integración de mapas.

## ✨ Características

- **Mapa Interactivo**: Muestra la ubicación del consultorio con un marcador
- **Integración de Navegación**:
  - Abrir en Google Maps (Android) / Apple Maps (iOS)
  - Integración directa con Waze
- **Ubicación del Usuario**: Muestra la posición actual del usuario en el mapa
- **Información del Consultorio**: Dirección, teléfono, horarios de atención
- **Click para Llamar**: Toca el número de teléfono para llamar
- **Responsive**: Funciona en todos los tamaños de pantalla

## 📦 Estructura

```
location/
├── components/
│   └── ClinicLocationMap.tsx    # Componente específico del consultorio
├── constants/
│   └── clinicLocation.ts        # Coordenadas e info del consultorio
├── types/
│   └── location.types.ts        # Interfaces TypeScript
└── index.ts
```

## 🏗️ Arquitectura

Este feature sigue el patrón de **separación de responsabilidades**:

- **Componentes Compartidos** (`@shared/components/Map`): Componentes genéricos reutilizables
  - `MapView`: Wrapper genérico de react-native-maps
  - `MapInfoRow`: Componente para mostrar información con iconos
  - `NavigationButtons`: Botones de navegación (Maps/Waze)
  - `useMapNavigation`: Hook para abrir mapas y hacer llamadas

- **Componentes del Feature** (`@features/location`): Lógica específica del consultorio
  - `ClinicLocationMap`: Componente que combina los componentes compartidos con la lógica del consultorio
  - `CLINIC_LOCATION`: Configuración específica de la clínica

## 🚀 Uso

```typescript
import { ClinicLocationMap } from "@features/location";

<ClinicLocationMap />
```

### Usando Componentes Compartidos Directamente

Si necesitas crear un mapa personalizado en otra feature:

```typescript
import { MapView, NavigationButtons, useMapNavigation } from "@shared";

function CustomMap() {
  return (
    <>
      <MapView
        initialRegion={{
          latitude: -32.9442426,
          longitude: -60.6505388,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        markers={[
          {
            coordinate: { latitude: -32.9442426, longitude: -60.6505388 },
            title: "Mi Ubicación",
            pinColor: "#007AFF",
          }
        ]}
        showsUserLocation
      />
      <NavigationButtons
        destination={{ latitude: -32.9442426, longitude: -60.6505388 }}
        destinationLabel="Mi Destino"
      />
    </>
  );
}
```

## ⚙️ Configuración

### 1. Actualizar Ubicación del Consultorio

Editar `src/features/location/constants/clinicLocation.ts`:

```typescript
export const CLINIC_LOCATION: ClinicLocation = {
  name: "Nombre del Consultorio",
  address: "Tu Dirección Aquí",
  coordinates: {
    latitude: -32.9442426,  // Tu latitud
    longitude: -60.6505388, // Tu longitud
  },
  phone: "+54 341 123 4567",
  email: "contacto@consultorio.com",
  workingHours: "Lun-Vie: 9:00 - 21:00",
};
```

**Cómo obtener coordenadas:**
1. Ir a [Google Maps](https://maps.google.com)
2. Click derecho en la ubicación del consultorio
3. Click en "Copiar coordenadas"
4. Pegar en `latitude` y `longitude`

### 2. ¿Por qué funciona sin API Key?

**Respuesta:** El mapa funciona actualmente porque:

1. **Expo Go en desarrollo**: Usa un API key temporal de Expo para pruebas
2. **Mapas básicos**: Los mapas base de Google Maps funcionan sin key en desarrollo
3. **Limitaciones**:
   - ⚠️ **Solo funciona en Expo Go / desarrollo**
   - ❌ **NO funcionará en producción** (build standalone)
   - ❌ **Límite de requests muy bajo**
   - ❌ **Sin garantías de disponibilidad**

### 3. Agregar Google Maps API Key (REQUERIDO para producción)

**Para Android:**

1. Obtener API key desde [Google Cloud Console](https://console.cloud.google.com)
2. Habilitar "Maps SDK for Android"
3. Actualizar `app.json`:

```json
{
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "TU_API_KEY_REAL_AQUI"
      }
    }
  }
}
```

**Para iOS:**

1. Usar la misma API key de Google Cloud Console
2. Habilitar "Maps SDK for iOS"
3. Actualizar `app.json`:

```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "TU_API_KEY_REAL_AQUI"
    }
  }
}
```

### 4. Probar en Dispositivo

```bash
# Iniciar Expo
npx expo start

# Escanear código QR con:
# - App Expo Go (iOS/Android)
# - App Cámara (solo iOS)
```

## 🎨 Personalización

### Cambiar Zoom del Mapa

Editar `MAP_INITIAL_DELTA` en `clinicLocation.ts`:

```typescript
export const MAP_INITIAL_DELTA = {
  latitudeDelta: 0.01,   // Menor = más zoom
  longitudeDelta: 0.01,
};
```

### Color del Marcador

El marcador usa automáticamente el color primario del tema de la app.

### Deshabilitar Ubicación del Usuario

En `LocationMap.tsx`, remover:

```typescript
showsUserLocation
showsMyLocationButton
```

## 📱 Permisos

La app solicita permisos de ubicación automáticamente:

- **iOS**: `NSLocationWhenInUseUsageDescription`
- **Android**: `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`

## 🔧 Solución de Problemas

### ¿Mapa no se muestra?

**En Desarrollo (Expo Go):**
- ✅ Debería funcionar sin API key
- Verificar conexión a internet
- Reiniciar Expo Go

**En Producción (Build standalone):**
1. Verificar que API key esté configurada correctamente
2. Asegurar que facturación esté habilitada en Google Cloud Console
3. Verificar que Maps SDK esté habilitado para tu plataforma

### ¿Permisos denegados?

1. Ir a Configuración del dispositivo
2. Buscar tu app
3. Habilitar permisos de Ubicación

### ¿Waze no abre?

El usuario necesita tener Waze instalado. El botón funcionará pero abrirá la versión web.

## 🌐 Navegación Externa

### Google Maps / Apple Maps

Abre la app de mapas nativa con direcciones al consultorio.

### Waze

Abre la app Waze (o versión web) con navegación iniciada.

## 📝 Notas Importantes

### Desarrollo vs Producción

| Aspecto | Desarrollo (Expo Go) | Producción (Build) |
|---------|---------------------|-------------------|
| **API Key** | ⚠️ Opcional (usa key de Expo) | ✅ **REQUERIDA** |
| **Funcionalidad** | ✅ Completa | ✅ Completa |
| **Límites** | ⚠️ Muy bajos | ✅ Según tu plan |
| **Confiabilidad** | ⚠️ No garantizada | ✅ Garantizada |

### Otros Puntos

- El mapa requiere conexión a internet
- La ubicación del usuario es opcional (el mapa funciona sin ella)
- Las coordenadas usan formato de grados decimales
- La ubicación por defecto está en Rosario, Argentina

## 🚀 Próximos Pasos

### Antes de Producción (IMPORTANTE):

1. ✅ Configurar Google Maps API Key
2. ✅ Habilitar facturación en Google Cloud
3. ✅ Actualizar coordenadas reales del consultorio
4. ✅ Probar en build de producción

### Mejoras Futuras Posibles:

- Cálculo de distancia desde usuario a consultorio
- Múltiples ubicaciones de consultorios
- Integración con Street View
- Información de estacionamiento
- Direcciones de transporte público
