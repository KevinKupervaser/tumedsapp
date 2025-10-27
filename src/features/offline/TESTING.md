# Guía de Pruebas: Funcionalidad Offline/Sync

## 📱 Cómo Probar en Expo Go

### Requisitos Previos

1. **Expo Go** instalado en tu dispositivo móvil
2. **Conexión WiFi** disponible
3. **Modo Avión** accesible en tu dispositivo

### Acceso a la Pantalla de Pruebas

1. Abre la app en Expo Go
2. Ve a la pestaña **"Offline Test"** en la barra de navegación inferior (ícono de nube ☁️)
3. Verás una pantalla completa de pruebas con:
   - 🟢/🔴 Estado de red en tiempo real
   - 📊 Estadísticas de sincronización
   - 🔘 Botones de acción
   - 📋 Lista de turnos offline

---

## 🧪 Escenarios de Prueba

### ✅ **Prueba 1: Crear Turno Offline**

**Pasos:**
1. Presiona el botón **"Crear Turno de Prueba"**
2. Observa que aparece un alert: "✅ Guardado Offline"
3. El turno aparece en la sección **"⏳ Pendientes"**
4. El contador de pendientes aumenta

**Resultado Esperado:**
- ✅ Turno se guarda localmente en AsyncStorage
- ✅ Status: `pending`
- ✅ Indicador muestra "1 turno pendiente"

---

### ✅ **Prueba 2: Modo Offline Completo**

**Pasos:**
1. **Activa el Modo Avión** en tu dispositivo
   - iOS: Desliza desde arriba → Toca ✈️
   - Android: Desliza desde arriba → Toca ✈️
2. Espera 3-5 segundos
3. Observa el indicador de estado

**Resultado Esperado:**
- ✅ Banner cambia a naranja: **"📴 Sin conexión - Trabajando offline"**
- ✅ Estado muestra: **"🔴 Offline"**
- ✅ Botones de sincronización se deshabilitan

---

### ✅ **Prueba 3: Crear Múltiples Turnos Offline**

**Pasos:**
1. Con modo avión **activo**
2. Presiona **"Crear Turno de Prueba"** varias veces (3-5 veces)
3. Observa la lista de pendientes

**Resultado Esperado:**
- ✅ Cada turno se guarda con un `localId` único
- ✅ Todos aparecen en **"⏳ Pendientes"**
- ✅ Contador aumenta: "3 turnos pendientes"
- ✅ App funciona perfectamente sin conexión

---

### ✅ **Prueba 4: Sincronización Automática**

**Pasos:**
1. Asegúrate de tener turnos pendientes (ej: 3 turnos)
2. **Desactiva el Modo Avión**
3. Espera 3-5 segundos
4. Observa el proceso de sincronización

**Resultado Esperado:**
- ✅ Indicador cambia a azul: **"🔄 Sincronizando..."**
- ✅ Los turnos pasan de **"⏳ Pendientes"** a **"🔄 Sincronizando"**
- ✅ Después van a **"✅ Sincronizados"**
- ✅ Se muestra: "Última sync: [fecha y hora]"
- ✅ Contador de pendientes llega a 0

---

### ✅ **Prueba 5: Sincronización Manual**

**Pasos:**
1. Activa modo avión
2. Crea 2-3 turnos de prueba
3. Desactiva modo avión
4. **NO esperes** la sincronización automática
5. Presiona **"Sincronizar Ahora"**

**Resultado Esperado:**
- ✅ Sincronización inicia inmediatamente
- ✅ Alert muestra: "✅ Sincronización exitosa - X turnos sincronizados"
- ✅ Los turnos se marcan como sincronizados

---

### ✅ **Prueba 6: Simulación de Error**

**Nota:** Para simular un error real, necesitarías que el servidor esté caído o modificar el código temporalmente.

**Alternativa de Prueba:**
1. Observa la sección **"❌ Errores"** (normalmente vacía)
2. Si hay errores, el botón **"Reintentar Errores"** se habilita
3. Presiona para reintentar

**Resultado Esperado:**
- ✅ Errores se muestran en rojo
- ✅ Mensaje de error incluido
- ✅ Botón de reintentar funcional

---

### ✅ **Prueba 7: Pull to Refresh**

**Pasos:**
1. En la pantalla de pruebas
2. Desliza hacia abajo (pull down)
3. Observa el indicador de recarga

**Resultado Esperado:**
- ✅ Spinner de recarga aparece
- ✅ Datos se actualizan desde AsyncStorage
- ✅ Estadísticas se refrescan

---

### ✅ **Prueba 8: Limpiar Datos Sincronizados**

**Pasos:**
1. Asegúrate de tener turnos en **"✅ Sincronizados"**
2. Presiona **"Limpiar Sincronizados"**
3. Observa la lista

**Resultado Esperado:**
- ✅ Turnos sincronizados se eliminan de AsyncStorage
- ✅ Solo quedan pendientes/errores (si los hay)
- ✅ Total de turnos offline disminuye

---

### ✅ **Prueba 9: Eliminar Todos los Turnos**

**Pasos:**
1. Presiona **"Eliminar Todos"**
2. Confirma en el alert
3. Observa la pantalla

**Resultado Esperado:**
- ✅ Alert de confirmación aparece
- ✅ Todos los turnos offline se eliminan
- ✅ Contadores en 0
- ✅ Listas vacías

---

## 🎯 Indicadores Visuales

### Banner de Sincronización

El banner en la parte superior cambia según el estado:

| Color | Estado | Mensaje |
|-------|--------|---------|
| 🟢 Verde | Todo sincronizado | No se muestra |
| 🔵 Azul | Pendientes | "Toca para sincronizar - X turnos pendientes" |
| 🟠 Naranja | Offline | "📴 Sin conexión - Trabajando offline" |
| 🔴 Rojo | Errores | "❌ Error en X turnos" |
| 🔄 Azul animado | Sincronizando | "🔄 Sincronizando..." |

---

## 📊 Qué Observar

### AsyncStorage (Datos Locales)

Los turnos se guardan con esta estructura:

```json
{
  "localId": "local_1234567890_abc123",
  "patient": "Paciente Test 1234567890",
  "doctor": "Dr. Álvaro Medina",
  "date": "25/10/2025",
  "time": "10:30",
  "phone": "+54 11 1234-5678",
  "email": "test@example.com",
  "observations": "Turno creado para prueba offline",
  "status": "scheduled",
  "syncStatus": "pending",
  "operation": "create",
  "createdAt": 1234567890000,
  "serverId": null,
  "error": null
}
```

### Estados de Sincronización

- **`pending`**: Esperando sincronización
- **`syncing`**: En proceso de sincronizar
- **`synced`**: Sincronizado exitosamente (tiene `serverId`)
- **`error`**: Falló la sincronización (tiene mensaje de `error`)

---

## 🐛 Problemas Comunes y Soluciones

### ❌ El estado no cambia a Offline

**Causa:** El polling puede tomar hasta 3 segundos
**Solución:** Espera 5 segundos después de activar modo avión

### ❌ Sincronización no inicia automáticamente

**Causa:** `autoSync` está deshabilitado o hay un error
**Solución:** Usa sincronización manual con el botón "Sincronizar Ahora"

### ❌ Los turnos no aparecen en la lista principal

**Causa:** La integración con la pantalla principal aún no está completa
**Solución:** Los turnos offline solo son visibles en la pantalla de pruebas por ahora

### ❌ Error al sincronizar

**Causas posibles:**
- Servidor mockapi.io está caído
- Error de red temporal
- Datos inválidos

**Solución:** Usa "Reintentar Errores" después de verificar la conexión

---

## 📝 Checklist de Prueba Completa

Marca cada item al completarlo:

- [ ] ✅ Crear turno con conexión activa
- [ ] ✅ Crear turno en modo avión
- [ ] ✅ Crear múltiples turnos offline
- [ ] ✅ Observar cambio de estado online → offline
- [ ] ✅ Observar cambio de estado offline → online
- [ ] ✅ Sincronización automática funciona
- [ ] ✅ Sincronización manual funciona
- [ ] ✅ Pull to refresh actualiza datos
- [ ] ✅ Limpiar turnos sincronizados funciona
- [ ] ✅ Eliminar todos los turnos funciona
- [ ] ✅ Contadores se actualizan correctamente
- [ ] ✅ Banner muestra estados correctos
- [ ] ✅ Estadísticas son precisas

---

## 🎓 Conceptos Clave

### AsyncStorage
- Almacenamiento local persistente
- Sobrevive a reinicios de la app
- Los datos permanecen hasta que se eliminan manualmente

### Network Polling
- Verifica conexión cada 3 segundos
- Usa `expo-network` para compatibilidad con Expo
- Detecta cambios en WiFi, celular, modo avión

### Sync Queue
- Los turnos se sincronizan en orden de creación
- Si uno falla, se marca como error pero continúa con los demás
- Los errores pueden reintentarse

### Auto Sync
- Se activa automáticamente cuando:
  - La conexión se restaura
  - Hay turnos pendientes
  - No hay sincronización en progreso

---

## 🔍 Debug Avanzado

### Ver Logs en Consola

Abre la terminal donde corre Expo y busca:

```
🔄 Conexión restaurada. Sincronizando datos...
Error checking network status: [error]
Error al obtener citas offline: [error]
```

### Verificar AsyncStorage

Puedes usar React Native Debugger para inspeccionar AsyncStorage:

```
@turnosapp/offline_appointments
@turnosapp/last_sync
```

---

## 📞 Soporte

Si encuentras bugs o comportamientos inesperados:

1. Anota los pasos para reproducirlo
2. Captura screenshots del estado
3. Revisa los logs de consola
4. Verifica que las dependencias estén instaladas:
   - `expo-network`
   - `@react-native-async-storage/async-storage`

---

**¡La funcionalidad offline está lista para probar en Expo Go!** 🚀
