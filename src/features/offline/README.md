# Feature: Offline / Sincronización

## Descripción General

El módulo de **Offline/Sincronización** permite a la aplicación funcionar sin conexión a internet, guardando los datos localmente y sincronizándolos automáticamente cuando la conexión se restaura. Proporciona una experiencia fluida para el usuario, incluso en condiciones de red inestables.

## Estructura del Módulo

```
src/features/offline/
├── components/
│   ├── SyncIndicator.tsx        # Indicador visual de sincronización
│   └── index.ts
├── hooks/
│   ├── useNetworkStatus.ts      # Detección de estado de red
│   ├── useOfflineSync.ts        # Hook principal de sincronización
│   └── index.ts
├── services/
│   ├── offlineService.ts        # Gestión de AsyncStorage
│   ├── syncService.ts           # Lógica de sincronización
│   └── index.ts
├── types/
│   ├── offline.types.ts         # Tipos TypeScript
│   └── index.ts
├── index.ts
└── README.md                    # Este archivo
```

## Tipos TypeScript

### SyncStatus

```typescript
type SyncStatus = "pending" | "syncing" | "synced" | "error";
```

Estados de sincronización:
- **`pending`**: Pendiente de sincronizar
- **`syncing`**: En proceso de sincronización
- **`synced`**: Sincronizado exitosamente
- **`error`**: Error durante la sincronización

### OfflineOperationType

```typescript
type OfflineOperationType = "create" | "update" | "delete";
```

Tipos de operación que se pueden realizar offline.

### OfflineAppointment

```typescript
interface OfflineAppointment extends AppointmentFormData {
  localId: string;           // ID temporal local
  syncStatus: SyncStatus;    // Estado de sincronización
  operation: OfflineOperationType;
  createdAt: number;         // Timestamp de creación
  serverId?: string;         // ID del servidor (si fue sincronizado)
  error?: string;            // Mensaje de error
}
```

Representa una cita guardada offline (borrador).

### SyncState

```typescript
interface SyncState {
  isSyncing: boolean;        // Sincronización en progreso
  lastSyncAt: number | null; // Timestamp última sincronización
  pendingCount: number;      // Items pendientes
  errorCount: number;        // Items con error
}
```

### SyncResult

```typescript
interface SyncResult {
  success: boolean;
  syncedCount: number;
  errorCount: number;
  errors: Array<{
    localId: string;
    error: string;
  }>;
}
```

## Hooks

### useNetworkStatus

Hook para detectar el estado de la conexión a internet.

**Retorno:**

```typescript
{
  isConnected: boolean;               // Si hay conexión
  isInternetReachable: boolean | null; // Si internet es accesible
  type: string | null;                // Tipo de conexión (wifi, cellular)
}
```

**Ejemplo de uso:**

```typescript
import { useNetworkStatus } from '@features/offline';

function MyComponent() {
  const { isConnected, type } = useNetworkStatus();

  return (
    <View>
      {isConnected ? (
        <Text>✅ Conectado ({type})</Text>
      ) : (
        <Text>❌ Sin conexión</Text>
      )}
    </View>
  );
}
```

### useOfflineSync

Hook principal para gestionar la sincronización offline.

**Parámetros:**

```typescript
autoSync?: boolean  // Sincronizar automáticamente al recuperar conexión (default: true)
```

**Retorno:**

```typescript
{
  // Estado de red
  isOnline: boolean;

  // Estado de sincronización
  syncState: SyncState;

  // Datos offline
  offlineAppointments: OfflineAppointment[];

  // Acciones
  saveOfflineAppointment: (data: AppointmentFormData) => Promise<OfflineAppointment>;
  syncNow: () => Promise<SyncResult>;
  retrySync: () => Promise<SyncResult>;
  deleteOfflineAppointment: (localId: string) => Promise<void>;
  clearSyncedData: () => Promise<void>;
  refreshOfflineData: () => Promise<void>;
}
```

**Ejemplo de uso básico:**

```typescript
import { useOfflineSync } from '@features/offline';

function AppointmentsList() {
  const {
    isOnline,
    syncState,
    offlineAppointments,
    saveOfflineAppointment,
    syncNow,
  } = useOfflineSync();

  const handleCreateOffline = async (data: AppointmentFormData) => {
    try {
      const offlineAppt = await saveOfflineAppointment(data);
      Alert.alert('Guardado offline', 'Se sincronizará cuando haya conexión');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar offline');
    }
  };

  return (
    <View>
      {/* Indicador de estado */}
      <Text>
        Estado: {isOnline ? 'Online' : 'Offline'}
      </Text>
      <Text>
        Pendientes: {syncState.pendingCount}
      </Text>

      {/* Botón de sincronización manual */}
      {isOnline && syncState.pendingCount > 0 && (
        <Button
          title="Sincronizar ahora"
          onPress={syncNow}
          disabled={syncState.isSyncing}
        />
      )}

      {/* Lista de borradores offline */}
      <FlatList
        data={offlineAppointments}
        renderItem={({ item }) => (
          <OfflineAppointmentCard appointment={item} />
        )}
      />
    </View>
  );
}
```

**Ejemplo: Sincronización automática:**

```typescript
import { useOfflineSync } from '@features/offline';
import { useEffect } from 'react';

function AppWithAutoSync() {
  const { isOnline, syncState, syncNow } = useOfflineSync(true);

  useEffect(() => {
    if (isOnline && syncState.pendingCount > 0) {
      console.log('🔄 Conexión restaurada, sincronizando...');
      // El hook ya sincroniza automáticamente con autoSync=true
    }
  }, [isOnline, syncState.pendingCount]);

  return <App />;
}
```

## Servicios

### OfflineService

Servicio para gestionar datos offline usando AsyncStorage.

**Métodos principales:**

```typescript
class OfflineService {
  // Obtener todas las citas offline
  static getAllOfflineAppointments(): Promise<OfflineAppointment[]>;

  // Guardar nueva cita offline
  static saveOfflineAppointment(
    data: AppointmentFormData,
    operation?: OfflineOperationType
  ): Promise<OfflineAppointment>;

  // Actualizar cita offline
  static updateOfflineAppointment(
    localId: string,
    updates: Partial<OfflineAppointment>
  ): Promise<void>;

  // Eliminar cita offline
  static deleteOfflineAppointment(localId: string): Promise<void>;

  // Obtener citas pendientes
  static getPendingAppointments(): Promise<OfflineAppointment[]>;

  // Obtener citas con error
  static getErrorAppointments(): Promise<OfflineAppointment[]>;

  // Marcar como sincronizada
  static markAsSynced(localId: string, serverId: string): Promise<void>;

  // Marcar con error
  static markAsError(localId: string, error: string): Promise<void>;

  // Limpiar citas sincronizadas
  static clearSyncedAppointments(): Promise<void>;

  // Obtener estadísticas
  static getOfflineStats(): Promise<{
    total: number;
    pending: number;
    syncing: number;
    synced: number;
    error: number;
  }>;
}
```

**Ejemplo de uso directo:**

```typescript
import { OfflineService } from '@features/offline';

async function guardarBorrador() {
  const cita = await OfflineService.saveOfflineAppointment({
    patient: "Juan Pérez",
    doctor: "Dr. Medina",
    date: "25/10/2025",
    time: "10:00",
    phone: "+54 11 1234-5678",
    email: "juan@example.com",
    status: "scheduled",
  });

  console.log('Cita guardada offline:', cita.localId);
}

async function verEstadisticas() {
  const stats = await OfflineService.getOfflineStats();
  console.log('Pendientes:', stats.pending);
  console.log('Con error:', stats.error);
}
```

### SyncService

Servicio para sincronizar datos offline con el servidor.

**Métodos principales:**

```typescript
class SyncService {
  // Sincronizar todo
  static syncAll(): Promise<SyncResult>;

  // Reintentar items con error
  static retryFailedSync(): Promise<SyncResult>;

  // Verificar si hay datos pendientes
  static hasPendingData(): Promise<boolean>;

  // Obtener conteo de pendientes
  static getPendingCount(): Promise<number>;
}
```

**Ejemplo de uso:**

```typescript
import { SyncService } from '@features/offline';

async function sincronizarManualmente() {
  const resultado = await SyncService.syncAll();

  if (resultado.success) {
    Alert.alert(
      'Sincronización exitosa',
      `${resultado.syncedCount} turnos sincronizados`
    );
  } else {
    Alert.alert(
      'Error parcial',
      `${resultado.syncedCount} sincronizados, ${resultado.errorCount} con error`
    );
  }
}

async function reintentarErrores() {
  const resultado = await SyncService.retryFailedSync();
  console.log('Reintento completado:', resultado);
}
```

## Componentes

### SyncIndicator

Indicador visual del estado de sincronización.

**Props:**

```typescript
interface SyncIndicatorProps {
  variant?: "banner" | "badge";  // Tipo de visualización
  onPress?: () => void;          // Callback al presionar
}
```

**Ejemplo de uso:**

```typescript
import { SyncIndicator } from '@features/offline';

// Banner en la parte superior de la pantalla
function AppointmentsScreen() {
  return (
    <View>
      <SyncIndicator variant="banner" />
      {/* Resto del contenido */}
    </View>
  );
}

// Badge pequeño en el header
function HeaderWithSync() {
  return (
    <View style={styles.header}>
      <Text>Mis Turnos</Text>
      <SyncIndicator
        variant="badge"
        onPress={() => console.log('Sync pressed')}
      />
    </View>
  );
}
```

**Estados visuales:**

- 🔄 **Sincronizando**: Spinner animado
- ☁️ **Pendientes**: Ícono de nube con contador
- ❌ **Error**: Ícono de error rojo
- 📴 **Offline**: Indicador naranja "Sin conexión"
- ✅ **Sincronizado**: No se muestra (oculto)

## Ejemplos Prácticos

### Ejemplo 1: Crear Turno con Fallback Offline

```typescript
import { useOfflineSync } from '@features/offline';
import { useAppointments } from '@features/appointments/hooks';

function CrearTurnoConOffline() {
  const { createAppointment } = useAppointments();
  const { isOnline, saveOfflineAppointment } = useOfflineSync();

  const handleSubmit = async (data: AppointmentFormData) => {
    if (isOnline) {
      try {
        // Intentar crear online
        await createAppointment(data);
        Alert.alert('Éxito', 'Turno creado');
      } catch (error) {
        // Si falla, guardar offline
        await saveOfflineAppointment(data);
        Alert.alert('Guardado offline', 'Se sincronizará cuando haya conexión');
      }
    } else {
      // Sin conexión, guardar directamente offline
      await saveOfflineAppointment(data);
      Alert.alert('Guardado offline', 'Se sincronizará automáticamente');
    }
  };

  return <AppointmentForm onSubmit={handleSubmit} />;
}
```

### Ejemplo 2: Lista con Datos Online y Offline

```typescript
import { useAppointments } from '@features/appointments/hooks';
import { useOfflineSync } from '@features/offline';

function ListaCompleta() {
  const { appointments: onlineAppointments, isLoading } = useAppointments();
  const { offlineAppointments, isOnline } = useOfflineSync();

  // Combinar appointments online y offline
  const allAppointments = useMemo(() => {
    // Filtrar solo pendientes offline
    const pending = offlineAppointments.filter(
      apt => apt.syncStatus === 'pending'
    );

    return [...onlineAppointments, ...pending];
  }, [onlineAppointments, offlineAppointments]);

  return (
    <View>
      {!isOnline && (
        <Text style={styles.warning}>
          📴 Trabajando offline - {offlineAppointments.length} borradores
        </Text>
      )}

      <FlatList
        data={allAppointments}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            isOffline={'localId' in item && !item.serverId}
          />
        )}
      />
    </View>
  );
}
```

### Ejemplo 3: Pantalla de Gestión de Sincronización

```typescript
import { useOfflineSync } from '@features/offline';

function PantallaSincronizacion() {
  const {
    isOnline,
    syncState,
    offlineAppointments,
    syncNow,
    retrySync,
    deleteOfflineAppointment,
    clearSyncedData,
  } = useOfflineSync();

  const pendingAppts = offlineAppointments.filter(a => a.syncStatus === 'pending');
  const errorAppts = offlineAppointments.filter(a => a.syncStatus === 'error');
  const syncedAppts = offlineAppointments.filter(a => a.syncStatus === 'synced');

  return (
    <ScrollView>
      {/* Estado general */}
      <Card>
        <Text>Estado: {isOnline ? '🟢 Online' : '🔴 Offline'}</Text>
        <Text>Última sync: {syncState.lastSyncAt ? new Date(syncState.lastSyncAt).toLocaleString() : 'Nunca'}</Text>
      </Card>

      {/* Acciones */}
      <View style={styles.actions}>
        <Button
          title="Sincronizar ahora"
          onPress={syncNow}
          disabled={!isOnline || syncState.isSyncing || pendingAppts.length === 0}
        />
        <Button
          title="Reintentar errores"
          onPress={retrySync}
          disabled={!isOnline || errorAppts.length === 0}
        />
        <Button
          title="Limpiar sincronizados"
          onPress={clearSyncedData}
          disabled={syncedAppts.length === 0}
        />
      </View>

      {/* Pendientes */}
      {pendingAppts.length > 0 && (
        <Section title={`Pendientes (${pendingAppts.length})`}>
          {pendingAppts.map(apt => (
            <OfflineAppointmentItem
              key={apt.localId}
              appointment={apt}
              onDelete={() => deleteOfflineAppointment(apt.localId)}
            />
          ))}
        </Section>
      )}

      {/* Errores */}
      {errorAppts.length > 0 && (
        <Section title={`Con Error (${errorAppts.length})`}>
          {errorAppts.map(apt => (
            <OfflineAppointmentItem
              key={apt.localId}
              appointment={apt}
              error={apt.error}
              onDelete={() => deleteOfflineAppointment(apt.localId)}
            />
          ))}
        </Section>
      )}
    </ScrollView>
  );
}
```

### Ejemplo 4: Integración en Pantalla Principal

```typescript
import { SyncIndicator } from '@features/offline';
import { useOfflineSync } from '@features/offline';

function HomeScreen() {
  const { syncState } = useOfflineSync();

  return (
    <View style={styles.container}>
      {/* Indicador de sincronización */}
      <SyncIndicator variant="banner" />

      {/* Contenido principal */}
      <AppointmentsList />

      {/* Badge flotante (opcional) */}
      {syncState.pendingCount > 0 && (
        <View style={styles.floatingBadge}>
          <SyncIndicator variant="badge" />
        </View>
      )}
    </View>
  );
}
```

## Flujo de Sincronización

### Crear Turno Offline

```
Usuario sin conexión
    ↓
Crea nuevo turno
    ↓
saveOfflineAppointment()
    ↓
Guarda en AsyncStorage con status="pending"
    ↓
Muestra en UI como "borrador"
    ↓
[Espera conexión]
    ↓
Conexión restaurada
    ↓
useOfflineSync detecta cambio
    ↓
Sincronización automática
    ↓
SyncService.syncAll()
    ↓
Crea en servidor
    ↓
Marca como "synced" con serverId
    ↓
Actualiza UI
```

### Manejo de Errores

```
Error durante sync
    ↓
Marca item como "error"
    ↓
Guarda mensaje de error
    ↓
Muestra en UI
    ↓
Usuario puede:
  - Reintentar (retrySync)
  - Editar y reintentar
  - Eliminar borrador
```

## Buenas Prácticas

1. **Usa sincronización automática**
   ```typescript
   // ✅ Correcto - Deja que el hook maneje la sync automática
   const { syncState } = useOfflineSync(true);

   // ❌ Evitar - Sincronización manual constante
   useEffect(() => {
     syncNow();
   }, [isOnline]);
   ```

2. **Indica visualmente el estado offline**
   ```typescript
   // ✅ Usa el SyncIndicator
   <SyncIndicator variant="banner" />

   // ✅ Marca items offline visualmente
   <AppointmentCard isOffline={!item.serverId} />
   ```

3. **Maneja errores de sincronización**
   ```typescript
   const { syncState, retrySync } = useOfflineSync();

   if (syncState.errorCount > 0) {
     return (
       <Banner severity="error">
         {syncState.errorCount} turnos no pudieron sincronizarse
         <Button onPress={retrySync}>Reintentar</Button>
       </Banner>
     );
   }
   ```

4. **Limpia datos sincronizados periódicamente**
   ```typescript
   const { clearSyncedData } = useOfflineSync();

   // Limpiar cada cierto tiempo
   useEffect(() => {
     const interval = setInterval(() => {
       clearSyncedData();
     }, 24 * 60 * 60 * 1000); // 24 horas

     return () => clearInterval(interval);
   }, []);
   ```

## Dependencias

- **@react-native-async-storage/async-storage**: Almacenamiento local
- **expo-network**: Detección de estado de red (compatible con Expo)
- **React Query**: Sincronización con caché del servidor

## Limitaciones

1. Solo funciona con turnos médicos (appointments)
2. No soporta edición offline de turnos existentes (solo creación)
3. Requiere Expo SDK 54+ o instalación de dependencias nativas

## Instalación de Dependencias

**Para proyectos Expo (recomendado):**
```bash
npx expo install @react-native-async-storage/async-storage
npx expo install expo-network
```

**Para proyectos React Native CLI:**
```bash
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
```

**Nota:** Este proyecto usa Expo, por lo que se recomienda usar `expo-network` en lugar de `@react-native-community/netinfo`.

## Ver También

- [Feature de Appointments](../appointments/README.md) - Sistema de turnos
- [Componentes Compartidos](../../shared/components/README.md) - Componentes UI
