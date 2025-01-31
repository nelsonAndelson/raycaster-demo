import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  assignedTo: z.string().min(1, 'Assignee is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  insightId: z.string(),
  category: z.string(),
  status: z.string().default('pending')
})

export type TaskFormValues = z.infer<typeof taskFormSchema>

export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
} as const

export const TEAM_MEMBERS = [
  { 
    id: 'anthony',
    name: 'Anthony Humay',
    role: 'Lead Developer',
    avatar: '/avatars/anthony_humay.jpeg'
  },
  { 
    id: 'jane-smith',
    name: 'Jane Smith',
    role: 'Designer',
    avatar: '/avatars/anthony_humay.jpeg' // Using same image as fallback
  },
  { 
    id: 'bob-johnson',
    name: 'Bob Johnson',
    role: 'Developer',
    avatar: '/avatars/anthony_humay.jpeg' // Using same image as fallback
  }
] as const

export type TeamMember = typeof TEAM_MEMBERS[number] 