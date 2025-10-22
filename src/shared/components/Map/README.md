# Componentes de Mapa Compartidos

Componentes de mapa genéricos y reutilizables que pueden usarse en diferentes features de la aplicación.

## Componentes

### `MapView`

Un wrapper genérico alrededor de `react-native-maps` que proporciona una experiencia de mapa consistente en toda la app.

**Props:**

- `initialRegion`: La región inicial a mostrar
- `markers`: Array de marcadores a mostrar en el mapa
- `showsUserLocation`: Mostrar ubicación actual del usuario (default: false)
- `showsMyLocationButton`: Mostrar botón para centrar en ubicación del usuario (default: false)
- `height`: Altura del contenedor del mapa (default: 250)
- `borderRadius`: Radio del borde del contenedor del mapa (default: 16)
- `containerStyle`: Estilos adicionales del contenedor
- `children`: Hijos adicionales del mapa (marcadores personalizados, polylines, etc.)

**Ejemplo:**

```tsx
import { MapView } from "@shared";

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
      description: "Este es mi lugar",
      pinColor: "#007AFF",
    },
  ]}
  showsUserLocation
  height={300}
/>;
```

### `MapInfoRow`

Un componente reutilizable para mostrar información de ubicación con un icono.

**Props:**

- `icon`: Nombre del icono de MaterialIcons
- `text`: Texto a mostrar
- `onPress`: Callback opcional cuando se presiona la fila
- `isLink`: Si se debe estilizar el texto como un enlace (default: false)

**Ejemplo:**

```tsx
import { MapInfoRow, useMapNavigation } from "@shared";

const { makePhoneCall } = useMapNavigation();

<MapInfoRow
  icon="phone"
  text="+54 341 123 4567"
  onPress={() => makePhoneCall("+54 341 123 4567")}
  isLink
/>;
```

### `NavigationButtons`

Botones para abrir apps de mapas nativas (Apple Maps/Google Maps) y Waze.

**Props:**

- `destination`: Coordenadas a las que navegar
- `destinationLabel`: Etiqueta para el destino
- `primaryColor`: Color del botón primario (usa el tema si no se proporciona)
- `showWaze`: Si se debe mostrar el botón de Waze (default: true)

**Ejemplo:**

```tsx
import { NavigationButtons } from "@shared";

<NavigationButtons
  destination={{ latitude: -32.9442426, longitude: -60.6505388 }}
  destinationLabel="Consultorio Médico"
  showWaze
/>;
```

## Hooks

### `useMapNavigation`

Hook que proporciona utilidades para navegación de mapas y llamadas telefónicas.

**Retorna:**

- `openInMaps(coordinates, label)`: Abre la app de mapas nativa
- `openInWaze(coordinates)`: Abre Waze
- `makePhoneCall(phoneNumber)`: Realiza una llamada telefónica

**Ejemplo:**

```tsx
import { useMapNavigation } from "@shared";

function MyComponent() {
  const { openInMaps, makePhoneCall } = useMapNavigation();

  const handleNavigate = () => {
    openInMaps(
      { latitude: -32.9442426, longitude: -60.6505388 },
      "Nombre del Consultorio"
    );
  };

  return <Button onPress={handleNavigate}>Navegar</Button>;
}
```

## Tipos

Todos los tipos TypeScript se exportan desde el paquete:

- `Coordinates`
- `MapMarkerData`
- `MapViewProps`
- `MapInfoRowProps`
- `NavigationButtonsProps`

## Arquitectura

Estos componentes siguen el **patrón de componente compartido**:

- **Componentes de UI puros** sin lógica de negocio
- **Reutilizables** a través de diferentes features
- **Configurables** mediante props
- **Componibles** - se pueden combinar para crear componentes específicos de features

### Ejemplo: Uso Específico de Feature

```tsx
// src/features/location/components/ClinicLocationMap.tsx
import { MapView, MapInfoRow, NavigationButtons } from '@shared';

export function ClinicLocationMap() {
  return (
    <View>
      <MapView
        initialRegion={...}
        markers={[...]}
      />
      <MapInfoRow icon="place" text={direccionConsultorio} />
      <NavigationButtons destination={coordenadasConsultorio} />
    </View>
  );
}
```
