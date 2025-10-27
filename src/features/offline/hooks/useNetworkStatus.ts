import { useState, useEffect } from "react";
import * as Network from "expo-network";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}

/**
 * Hook para detectar el estado de la conexión a internet
 * Usa expo-network para compatibilidad con Expo
 *
 * @returns Estado de la conexión y reachability
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { isConnected, isInternetReachable } = useNetworkStatus();
 *
 *   if (!isConnected) {
 *     return <Text>Sin conexión</Text>;
 *   }
 *
 *   return <Text>Conectado</Text>;
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: null,
  });

  useEffect(() => {
    let isMounted = true;

    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();

        if (isMounted) {
          setNetworkStatus({
            isConnected: networkState.isConnected ?? false,
            isInternetReachable: networkState.isInternetReachable ?? null,
            type: networkState.type || null,
          });
        }
      } catch (error) {
        console.error("Error checking network status:", error);
        if (isMounted) {
          setNetworkStatus({
            isConnected: false,
            isInternetReachable: false,
            type: null,
          });
        }
      }
    };

    // Check initial state
    checkNetworkStatus();

    // Poll network status every 3 seconds
    const interval = setInterval(checkNetworkStatus, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return networkStatus;
}
