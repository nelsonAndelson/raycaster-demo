"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createTaskNote } from '@/app/db/supabase'

const noteFormSchema = z.object({
  content: z.string().min(1, 'Note content is required').max(1000, 'Note is too long')
})

type NoteFormValues = z.infer<typeof noteFormSchema>

interface NoteInputProps {
  insightId: string
  taskId: string
  userId: string
  onNoteAdded?: () => void
}

export function NoteInput({ insightId, taskId, userId, onNoteAdded }: NoteInputProps) {
  const { toast } = useToast()
  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: ''
    }
  })

  const onSubmit = async (data: NoteFormValues) => {
    try {
      await createTaskNote(data.content.trim(), taskId, userId )
      form.reset()
      toast({
        title: 'Note added',
        description: 'Your note has been added successfully.',
      })
      onNoteAdded?.()
    } catch (error) {
      console.error('Error adding note:', error)
      toast({
        title: 'Error',
        description: 'Failed to add note. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Add a note..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <span className="mr-2">Adding note...</span>
              <span className="animate-spin">⏳</span>
            </>
          ) : (
            'Add Note'
          )}
        </Button>
      </form>
    </Form>
  )
} 