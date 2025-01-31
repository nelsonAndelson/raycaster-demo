import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Utility function to transform snake_case to camelCase
function toCamelCase<T extends Record<string, any>>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v))
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([-_][a-z])/g, group =>
          group.toUpperCase().replace('-', '').replace('_', '')
        )]: toCamelCase(obj[key])
      }),
      {}
    )
  }
  return obj
}

// Helper functions for type-safe database access
export const getInsights = async () => {
  const response = await supabase.from('insights').select('*')
  return {
    ...response,
    data: response.data ? toCamelCase(response.data) : null
  }
}

export const getTasks = async () => {
  const response = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  return {
    ...response,
    data: response.data ? response.data.map(task => ({
      id: task.id,
      title: task.title,
      status: task.status,
      assignedTo: task.assigned_to,
      insightId: task.insight_id,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      category: task.category,
      description: task.description,
      dueDate: task.due_date
    })) : null
  }
}

export const createInsight = (insight: Database['public']['Tables']['insights']['Insert']) =>
  supabase.from('insights').insert(insight)

export const createTask = async (task: Database['public']['Tables']['tasks']['Insert']) => {
  console.log('=== CREATE TASK DEBUG ===')
  console.log('1. Input task data:', task)
  
  const taskData = {
    title: task.title,
    status: task.status || 'pending',
    assigned_to: task.assigned_to,
    insight_id: task.insight_id,
    category: task.category,
    description: task.description,
    due_date: task.due_date
  }
  
  console.log('2. Transformed task data:', taskData)

  const { data: newTask, error: taskError } = await supabase
    .from('tasks')
    .insert(taskData)
    .select('*')
    .single()

  if (taskError) {
    console.error('3. Task creation error:', taskError)
    throw taskError
  }

  // Create an activity record for the new task
  const activityData = {
    type: 'task_created',
    content: { task: newTask.title, status: newTask.status },
    task_id: newTask.id,
    insight_id: newTask.insight_id,
    user_id: task.assigned_to // Using assigned_to as the user_id for the activity
  }

  const { error: activityError } = await supabase
    .from('activities')
    .insert(activityData)

  if (activityError) {
    console.error('4. Activity creation error:', activityError)
    // Don't throw here, as the task was still created successfully
  }

  console.log('5. Successfully created task with activity:', newTask)
  return toCamelCase(newTask)
}

export const updateTask = async (id: string, task: Database['public']['Tables']['tasks']['Update']) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(task)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return toCamelCase(data)
}

export const getNotes = async (insightId?: string, taskId?: string) => {
  let query = supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  if (insightId) {
    query = query.eq('insight_id', insightId)
  }
  if (taskId) {
    query = query.eq('task_id', taskId)
  }

  const { data, error } = await query
  if (error) throw error

  return toCamelCase(data)
}

export const createTaskNote = async (
  content: string,
  taskId: string,
  userId: string
) => {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('insight_id')
    .eq('id', taskId)
    .single()

  if (taskError) throw taskError

  const { data, error } = await supabase
    .from('notes')
    .insert({
      content,
      task_id: taskId,
      insight_id: task.insight_id, // Maintain relationship hierarchy
      user_id: userId
    })
    .select()
    .single()

  if (error) throw error
  return toCamelCase(data)
}

export const getTaskWithRelated = async (taskId: string) => {
  const [taskResult, notesResult, activitiesResult] = await Promise.all([
    supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .single(),
    supabase
      .from('notes')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false }),
    supabase
      .from('activities')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false })
  ])

  if (taskResult.error) throw taskResult.error

  return {
    task: toCamelCase(taskResult.data),
    notes: notesResult.data ? toCamelCase(notesResult.data) : [],
    activities: activitiesResult.data ? toCamelCase(activitiesResult.data) : []
  }
}

export const getActivities = async (insightId?: string, taskId?: string) => {
  let query = supabase
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (insightId) {
    query = query.eq('insight_id', insightId)
  }
  if (taskId) {
    query = query.eq('task_id', taskId)
  }

  const { data, error } = await query
  if (error) throw error

  return toCamelCase(data)
}