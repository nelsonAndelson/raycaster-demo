"use client"

import { useEffect, useState } from 'react'
import { Activity } from '@/types/database'
import { getActivities } from '@/app/db/supabase'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TimelineProps {
  insightId?: string
  taskId?: string
}

export function Timeline({ insightId, taskId }: TimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const data = await getActivities(insightId, taskId)
        setActivities(data || [])
      } catch (error) {
        console.error('Error loading activities:', error)
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [insightId, taskId])

  if (loading) {
    return <div className="p-4 text-center">Loading activities...</div>
  }

  if (!activities.length) {
    return <div className="p-4 text-center text-muted-foreground">No activities yet</div>
  }

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/avatars/${activity.userId}.png`} alt={activity.userId} />
              <AvatarFallback>{activity.userId.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <Badge variant={activity.type === 'note' ? 'secondary' : 'default'}>
                  {activity.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{activity.content}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
} 