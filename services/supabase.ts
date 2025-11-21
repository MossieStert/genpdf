import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ToolType, HistoryItem } from '../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const createSafeClient = () => {
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }
  
  console.warn('Supabase credentials missing. Auth and History features will be disabled.');
  
  // Mock client to prevent app crash
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          order: (column: string, opts?: any) => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: (values: any) => Promise.resolve({ data: null, error: null })
    })
  } as unknown as SupabaseClient;
}

export const supabase = createSafeClient();

export const saveHistory = async (
  userId: string,
  toolType: ToolType,
  fileName: string,
  content: string | null
) => {
  if (!supabaseUrl || !supabaseKey) return;

  // We only store the first 100KB of text content to avoid hitting row size limits on free tier easily
  // For binary operations (Merge/Split), content will be a status message or null.
  const contentToSave = content ? content.slice(0, 100000) : null;

  const { error } = await supabase.from('history').insert({
    user_id: userId,
    tool_type: toolType,
    file_name: fileName,
    content: contentToSave
  });

  if (error) {
    console.error('Error saving history:', error);
  }
};

export const fetchHistory = async (userId: string): Promise<HistoryItem[]> => {
  if (!supabaseUrl || !supabaseKey) return [];

  const { data, error } = await supabase
    .from('history')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching history:', error);
    return [];
  }

  return data as HistoryItem[];
};