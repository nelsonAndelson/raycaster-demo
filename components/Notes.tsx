"use client"

import { useEffect, useState, useCallback } from 'react'
import { Note } from '@/types/database'
import { getNotes, supabase } from '@/app/db/supabase'
import { NoteInput } from '@/components/NoteInput'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { TEAM_MEMBERS } from '@/types/task'

interface NotesProps {
  insightId: string
  taskId: string
  userId: string
}

export function Notes({ insightId, taskId, userId }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const getTeamMember = (userId: string) => {
    return TEAM_MEMBERS.find(member => member.id === userId) || {
      id: userId,
      name: userId,
      role: 'Team Member',
      avatar: '/avatars/anthony_humay.jpeg' // Fallback to default avatar
    }
  }

  const loadNotes = useCallback(async () => {
    try {
      const data = await getNotes(insightId, taskId)
      setNotes(data || [])
    } catch (error) {
      console.error('Error loading notes:', error)
      toast({
        title: 'Error',
        description: 'Failed to load notes. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [insightId, taskId, toast])

  useEffect(() => {
    loadNotes()
  }, [loadNotes])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel('notes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `task_id=eq.${taskId}`
        },
        async () => {
          await loadNotes()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [taskId, loadNotes])

  const handleNoteAdded = useCallback(() => {
    loadNotes()
  }, [loadNotes])

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading notes...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NoteInput
        insightId={insightId}
        taskId={taskId}
        userId={userId}
        onNoteAdded={handleNoteAdded}
      />
      <Separator />
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {notes.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No notes yet. Be the first to add one!
            </div>
          ) : (
            notes.map((note) => {
              const member = getTeamMember(note.userId)
              return (
                <div key={note.id} className="flex space-x-4 group">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(note.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground break-words whitespace-pre-wrap">
                      {note.content}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
} 