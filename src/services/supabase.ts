import { createClient } from '@supabase/supabase-js';
import { ToolType, HistoryItem } from '../types';

// These come from Vite's env system (NOT process.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };

export const saveHistory = async (
  userId: string,
  toolType: ToolType,
  fileName: string,
  content: string | null
) => {
  if (!supabaseUrl || !supabaseAnonKey) return;

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
  if (!supabaseUrl || !supabaseAnonKey) return [];

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
