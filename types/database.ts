export interface InsightCard {
  id: string
  company_name: string
  title: string
  confidence: number
  companyValue: string
  commonObjections: string[]
  recommendedResponses: string[]
  sourcesAndReferences: string[]
  lastUpdated: string
  category: 'patent' | 'clinical' | 'market'
}

export interface Task {
  id: string
  title: string
  status: 'completed' | 'in-progress' | 'pending'
  assignedTo: string
  createdAt: string
  updatedAt: string
  insightId: string
}

export interface Database {
  public: {
    Tables: {
      insights: {
        Row: InsightCard
        Insert: Omit<InsightCard, 'id'>
        Update: Partial<InsightCard>
      }
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
        Update: Partial<Task>
      }
    }
  }
} 