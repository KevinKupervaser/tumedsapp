# Feature: Settings (Sistema de Temas)

## Descripción General

El módulo de **Settings** gestiona la configuración del tema visual de la aplicación. Proporciona un sistema completo de temas con soporte para modo claro, oscuro y automático (basado en el sistema), utilizando Redux para la persistencia del estado.

## Estructura del Módulo

```
src/features/settings/
├── hooks/
│   └── useTheme.ts          # Hook principal para acceder al tema
├── store/
│   └── themeSlice.ts        # Redux slice para gestión de estado
└── README.md                # Este archivo
```

## Tipos TypeScript

### ThemeMode

```typescript
type ThemeMode = 'light' | 'dark' | 'system';
```

Modos de tema disponibles:
- **`light`**: Tema claro forzado
- **`dark`**: Tema oscuro forzado
- **`system`**: Sigue la preferencia del sistema operativo

### ThemeState

```typescript
interface ThemeState {
  mode: ThemeMode;
}
```

Estado almacenado en Redux para persistir la preferencia del usuario.

### Theme

```typescript
interface Theme {
  background: string;      // Color de fondo principal
  card: string;           // Color de fondo para tarjetas
  text: string;           // Color de texto principal
  textSecondary: string;  // Color de texto secundario
  primary: string;        // Color primario de la marca
  border: string;         // Color de bordes
  error: string;          // Color para errores
  success: string;        // Color para éxito
  warning: string;        // Color para advertencias
}
```

## Hook: useTheme

### Descripción

Hook principal que proporciona acceso al tema actual y funciones para cambiarlo.

### Retorno

```typescript
{
  theme: Theme;              // Objeto con todos los colores del tema
  themeMode: ThemeMode;      // Modo actual ('light' | 'dark' | 'system')
  isDark: boolean;           // true si el tema actual es oscuro
  setTheme: (mode: ThemeMode) => void;  // Función para cambiar el tema
}
```

### Ejemplo de Uso Básico

```typescript
import { useTheme } from '@features/settings';
import { View, Text, StyleSheet } from 'react-native';

function MiComponente() {
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={{ color: theme.text }}>
        Tema actual: {isDark ? 'Oscuro' : 'Claro'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
});
```

### Ejemplo: Cambiar el Tema

```typescript
import { useTheme } from '@features/settings';
import { View, Button } from 'react-native';

function ConfiguracionTema() {
  const { themeMode, setTheme } = useTheme();

  return (
    <View>
      <Button
        title="Tema Claro"
        onPress={() => setTheme('light')}
      />
      <Button
        title="Tema Oscuro"
        onPress={() => setTheme('dark')}
      />
      <Button
        title="Automático (Sistema)"
        onPress={() => setTheme('system')}
      />
    </View>
  );
}
```

### Ejemplo: Estilos Adaptativos

```typescript
import { useTheme } from '@features/settings';
import { View, Text, StyleSheet } from 'react-native';

function TarjetaAdaptativa() {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          // Estilos específicos según el tema
          shadowColor: isDark ? '#000' : theme.text,
          shadowOpacity: isDark ? 0.3 : 0.1,
        },
      ]}
    >
      <Text style={{ color: theme.text }}>Contenido</Text>
      <Text style={{ color: theme.textSecondary }}>Subtítulo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});
```

## Redux Store: themeSlice

### Descripción

El slice de Redux gestiona el estado global del tema y persiste la preferencia del usuario.

### Acciones Disponibles

#### setThemeMode

```typescript
dispatch(setThemeMode('dark'));
```

Cambia el modo del tema. Acepta `'light'`, `'dark'`, o `'system'`.

### Selectores

```typescript
import { useAppSelector } from '@core/store';

function MiComponente() {
  const themeMode = useAppSelector((state) => state.theme.mode);

  return <Text>Modo actual: {themeMode}</Text>;
}
```

### Estado Inicial

```typescript
{
  mode: 'system'  // Por defecto sigue la preferencia del sistema
}
```

## Paletas de Colores

### Tema Claro

```typescript
{
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#000000',
  textSecondary: '#6C757D',
  primary: '#007AFF',
  border: '#DEE2E6',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
}
```

### Tema Oscuro

```typescript
{
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#98989D',
  primary: '#0A84FF',
  border: '#38383A',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FF9F0A',
}
```

## Ejemplos Prácticos

### Ejemplo 1: Botón con Tema

```typescript
import { useTheme } from '@features/settings';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'error' | 'success';
}

function ThemedButton({ title, onPress, variant = 'primary' }: ThemedButtonProps) {
  const { theme, isDark } = useTheme();
  const color = theme[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark ? color + '20' : color + '10',
          borderColor: color + '30',
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});
```

### Ejemplo 2: Íconos con Color Dinámico

```typescript
import { useTheme } from '@features/settings';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

function IconoTematico({ name }: { name: string }) {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={{
        backgroundColor: isDark ? theme.primary + '20' : theme.primary + '10',
        padding: 8,
        borderRadius: 8,
      }}
    >
      <MaterialIcons name={name} size={24} color={theme.primary} />
    </View>
  );
}
```

### Ejemplo 3: Selector de Tema con UI

```typescript
import { useTheme } from '@features/settings';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

function SelectorTema() {
  const { theme, themeMode, setTheme } = useTheme();

  const opciones = [
    { mode: 'light' as const, label: 'Claro', icon: 'light-mode' },
    { mode: 'dark' as const, label: 'Oscuro', icon: 'dark-mode' },
    { mode: 'system' as const, label: 'Sistema', icon: 'settings-brightness' },
  ];

  return (
    <View style={styles.container}>
      {opciones.map(({ mode, label, icon }) => {
        const isSelected = themeMode === mode;

        return (
          <TouchableOpacity
            key={mode}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? theme.primary : theme.card,
                borderColor: isSelected ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setTheme(mode)}
          >
            <MaterialIcons
              name={icon}
              size={24}
              color={isSelected ? '#FFFFFF' : theme.text}
            />
            <Text
              style={[
                styles.label,
                { color: isSelected ? '#FFFFFF' : theme.text },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  option: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
```

## Integración con Componentes Compartidos

Los componentes en `@shared/components` como `ThemedView` y `ThemedText` utilizan automáticamente este sistema de temas:

```typescript
import { ThemedView, ThemedText } from '@shared';

function MiPantalla() {
  return (
    <ThemedView style={{ padding: 16 }}>
      <ThemedText type="title">Título</ThemedText>
      <ThemedText>Texto normal que se adapta al tema</ThemedText>
    </ThemedView>
  );
}
```

## Buenas Prácticas

1. **Usa el hook `useTheme` en lugar de acceder directamente a Redux**
   ```typescript
   // ✅ Correcto
   const { theme } = useTheme();

   // ❌ Evitar
   const theme = useAppSelector(state => state.theme);
   ```

2. **Usa `isDark` para lógica condicional**
   ```typescript
   const { theme, isDark } = useTheme();
   const opacity = isDark ? 0.3 : 0.1;
   ```

3. **Aplica transparencias con hexadecimal**
   ```typescript
   backgroundColor: theme.primary + '20'  // 20% de opacidad
   backgroundColor: theme.error + '10'    // 10% de opacidad
   ```

4. **Componentes adaptativos**
   - Usa los colores del tema en lugar de valores hardcodeados
   - Ajusta sombras y opacidades según `isDark`
   - Provee suficiente contraste en ambos temas

## Dependencias

- **Redux Toolkit**: Gestión de estado global
- **React Native Appearance**: Detección del tema del sistema
- **AsyncStorage**: Persistencia de la preferencia del usuario (via Redux Persist)

## Ver También

- [Feature de Appointments](../appointments/README.md) - Uso del tema en tarjetas de citas
- [Feature de Doctors](../doctors/README.md) - Uso del tema en tarjetas de doctores
- [Componentes Compartidos](../../shared/components/README.md) - ThemedView y ThemedText
