import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for type-safe database access
export const getInsights = () => supabase.from('insights').select('*')
export const getTasks = () => supabase.from('tasks').select('*')

export const createInsight = (insight: Database['public']['Tables']['insights']['Insert']) =>
  supabase.from('insights').insert(insight)

export const createTask = (task: Database['public']['Tables']['tasks']['Insert']) =>
  supabase.from('tasks').insert(task)

export const updateTask = (id: string, task: Database['public']['Tables']['tasks']['Update']) =>
  supabase.from('tasks').update(task).eq('id', id)