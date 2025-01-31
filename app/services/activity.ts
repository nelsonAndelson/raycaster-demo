import { supabase } from '@/app/db/supabase'

export const ActivityService = {
  logTaskCreation: async (taskId: string, taskTitle: string, taskStatus: string, insightId: string, userId: string) => {
    try {
      await supabase
        .from('activities')
        .insert({
          type: 'task_created',
          content: { task: taskTitle, status: taskStatus },
          task_id: taskId,
          insight_id: insightId,
          user_id: userId
        })
    } catch (error) {
      // Just log the error, don't throw
      console.error('Failed to log task creation activity:', error)
    }
  }
} 