'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { taskFormSchema, TaskFormValues, TEAM_MEMBERS } from '@/types/task'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { createTask } from '@/app/db/supabase'

interface AssignTaskModalProps {
  open: boolean
  onClose: () => void
  insightId: string
  insightCategory: string
  companyName: string
}

export default function AssignTaskModal({
  open,
  onClose,
  insightId,
  insightCategory,
}: AssignTaskModalProps) {
  const { toast } = useToast()
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
      insightId,
      category: insightCategory,
      status: 'pending'
    }
  })

  const onSubmit = async (data: TaskFormValues) => {
    try {
      console.log('Form values:', JSON.stringify(data, null, 2))
      
      const taskData = {
        title: data.title,
        description: data.description,
        assigned_to: data.assignedTo,
        insight_id: data.insightId,
        status: data.status,
        due_date: data.dueDate,
        category: data.category
      }
      
      console.log('Prepared task data:', JSON.stringify(taskData, null, 2))
      
      const task = await createTask(taskData)
      console.log('Created task response:', JSON.stringify(task, null, 2))

      toast({
        title: 'Success',
        description: `Task "${task.title}" created and assigned to ${task.assignedTo}`,
      })
      
      form.reset()
      onClose()
    } catch (error) {
      console.error('Task creation error details:', {
        error,
        errorType: error instanceof Error ? 'Error' : typeof error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        formData: data
      })
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create task. Please try again.'
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Create a new task for the {insightCategory} insight
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEAM_MEMBERS.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} className="bg-blue-500 hover:bg-blue-600">
                {form.formState.isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 
