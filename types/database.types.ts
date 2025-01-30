export interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'completed'
  insight_category: string | null
  due_date: string | null
  created_at: string
}

export interface Note {
  id: string
  content: string
  insight_category: string | null
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at'>
        Update: Partial<Omit<Task, 'id' | 'created_at'>>
      }
      notes: {
        Row: Note
        Insert: Omit<Note, 'id' | 'created_at'>
        Update: Partial<Omit<Note, 'id' | 'created_at'>>
      }
    }
  }
} 