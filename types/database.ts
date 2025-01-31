export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Database types (snake_case)
export interface Database {
  public: {
    Tables: {
      insights: {
        Row: {
          id: string
          company_name: string
          title: string
          confidence: number
          category: string
          company_value: string
          common_objections: Json | null
          recommended_responses: Json | null
          sources_and_references: Json | null
          active_trials: number | null
          key_indications: string[] | null
          key_patent_areas: string[] | null
          market_size: number | null
          competitors: Json | null
          patent_count: number | null
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          company_name: string
          title: string
          confidence: number
          category: string
          company_value: string
          common_objections?: Json | null
          recommended_responses?: Json | null
          sources_and_references?: Json | null
          active_trials?: number | null
          key_indications?: string[] | null
          key_patent_areas?: string[] | null
          market_size?: number | null
          competitors?: Json | null
          patent_count?: number | null
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          title?: string
          confidence?: number
          category?: string
          company_value?: string
          common_objections?: Json | null
          recommended_responses?: Json | null
          sources_and_references?: Json | null
          active_trials?: number | null
          key_indications?: string[] | null
          key_patent_areas?: string[] | null
          market_size?: number | null
          competitors?: Json | null
          patent_count?: number | null
          last_updated?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          status: string
          assigned_to: string
          insight_id: string
          created_at: string
          updated_at: string
          category: string | null
          description: string | null
          due_date: string | null
        }
        Insert: {
          id?: string
          title: string
          status?: string
          assigned_to: string
          insight_id: string
          created_at?: string
          updated_at?: string
          category?: string | null
          description?: string | null
          due_date?: string | null
        }
        Update: {
          id?: string
          title?: string
          status?: string
          assigned_to?: string
          insight_id?: string
          created_at?: string
          updated_at?: string
          category?: string | null
          description?: string | null
          due_date?: string | null
        }
      }
      notes: {
        Row: {
          id: string
          content: string
          insight_id: string | null
          task_id: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          insight_id?: string | null
          task_id?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          insight_id?: string | null
          task_id?: string | null
          user_id?: string
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          type: string
          content: Json
          insight_id: string | null
          task_id: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          type: string
          content: Json
          insight_id?: string | null
          task_id?: string | null
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          type?: string
          content?: Json
          insight_id?: string | null
          task_id?: string | null
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}

// Component types (camelCase)
export interface InsightCard {
  id: string
  companyName: string
  title: string
  confidence: number
  category: string
  companyValue: string
  commonObjections: string[] | null
  recommendedResponses: string[] | null
  sourcesAndReferences: string[] | null
  activeTrials: number | null
  keyIndications: string[] | null
  keyPatentAreas: string[] | null
  marketSize: number | null
  competitors: string[] | null
  patentCount: number | null
  lastUpdated: string
  createdAt: string
}

export interface Task {
  id: string
  title: string
  status: string
  assignedTo: string
  insightId: string
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  content: string
  insightId: string | null
  taskId: string | null
  userId: string
  createdAt: string
}

export interface Activity {
  id: string
  type: string
  content: any
  insightId: string | null
  taskId: string | null
  userId: string
  createdAt: string
}
