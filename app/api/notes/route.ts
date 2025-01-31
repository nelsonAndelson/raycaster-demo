import { supabase } from '@/app/db/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { content, insightId, taskId, userId } = await req.json()
    
    const { data, error } = await supabase
      .from('notes')
      .insert({
        content,
        insight_id: insightId,
        task_id: taskId,
        user_id: userId
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating note:', error)
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const insightId = searchParams.get('insightId')
    const taskId = searchParams.get('taskId')
    
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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    )
  }
} 