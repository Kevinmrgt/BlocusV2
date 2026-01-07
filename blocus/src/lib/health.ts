import { supabase } from './supabase';
import NetInfo from '@react-native-community/netinfo';

export interface HealthStatus {
  network: boolean;
  api: boolean;
  timestamp: string;
}

export const Health = {
  /**
   * Check Supabase API connectivity
   */
  checkSupabase: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.from('gyms').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Check network connectivity
   */
  checkNetwork: async (): Promise<boolean> => {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  },

  /**
   * Get combined health status
   */
  getStatus: async (): Promise<HealthStatus> => ({
    network: await Health.checkNetwork(),
    api: await Health.checkSupabase(),
    timestamp: new Date().toISOString(),
  }),
};
