import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

interface CreateApiKeyDTO {
  name: string;
  key: string;
  user_id: string;
  monthly_limit: number | null;
}

export const apiKeysService = {
  async getApiKeys(userId: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async createApiKey(dto: CreateApiKeyDTO) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{
        name: dto.name,
        key: dto.key,
        user_id: dto.user_id,
        monthly_limit: dto.monthly_limit,
        usage: 0,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateApiKey(id: string, updates: Partial<CreateApiKeyDTO>) {
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