export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key: string;
  monthly_limit: number | null;
  usage: number;
  created_at: string;
} 