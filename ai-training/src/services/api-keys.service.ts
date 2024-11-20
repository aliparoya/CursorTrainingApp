import { supabase } from '@/lib/supabase';
import type { ApiKey } from '@/types/database.types';

export const apiKeysService = {
  async getApiKeys(userId: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createApiKey(apiKey: Omit<ApiKey, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([apiKey])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApiKey(id: string, updates: Partial<ApiKey>) {
    const { data, error } = await supabase
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteApiKey(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}; 