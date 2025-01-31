"use client"

import { useState, useEffect } from 'react'
import { Database } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Notes } from '@/components/Notes'
import { Timeline } from '@/components/Timeline'
import { TEAM_MEMBERS } from '@/types/task'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Task = {
  id: string
  title: string
  status: string
  assignedTo: string
  insightId: string
  createdAt: string
  updatedAt: string
  description: string | null
  dueDate: string | null
}

interface TaskListProps {
  tasks: Task[]
  companyName: string
}

export default function TaskList({ tasks, companyName }: TaskListProps) {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string>(TEAM_MEMBERS[0].id)

  // Load selected user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('selectedUserId')
    if (savedUserId) {
      setSelectedUserId(savedUserId)
    }
  }, [])

  // Save selected user to localStorage
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    localStorage.setItem('selectedUserId', userId)
  }

  const completedTasks = tasks.filter(task => task.status === 'completed')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const pendingTasks = tasks.filter(task => task.status === 'pending')

  const totalTasks = tasks.length
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks.length / totalTasks) * 100) 
    : 0

  const getTeamMemberName = (id: string) => {
    const member = TEAM_MEMBERS.find(m => m.id === id)
    return member?.name || id
  }

  const getTeamMemberInitials = (id: string) => {
    const name = getTeamMemberName(id)
    return name.split(' ').map(n => n[0]).join('')
  }

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team Activity</h2>
          <div className="w-[200px]">
            <Select value={selectedUserId} onValueChange={handleUserChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_MEMBERS.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{getTeamMemberInitials(member.id)}</AvatarFallback>
                      </Avatar>
                      <span>{member.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Task Progress */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm text-gray-500">Task Progress</span>
            <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <div className="text-sm font-medium">Completed</div>
                <div className="text-sm text-gray-500">({completedTasks.length})</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div>
                <div className="text-sm font-medium">In Progress</div>
                <div className="text-sm text-gray-500">({inProgressTasks.length})</div>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <div>
                <div className="text-sm font-medium">Pending</div>
                <div className="text-sm text-gray-500">({pendingTasks.length})</div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Members */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Active Members</h3>
          <div className="flex -space-x-2">
            {Array.from(new Set(tasks.map(task => task.assignedTo))).map((memberId) => (
              <Avatar key={memberId} className="border-2 border-white">
                <AvatarFallback>{getTeamMemberInitials(memberId)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Tasks</h3>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{task.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="ml-2"
                    >
                      {expandedTaskId === task.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  )}
                </div>
                <Badge
                  variant={
                    task.status === 'completed' ? 'success' :
                    task.status === 'in-progress' ? 'warning' :
                    'secondary'
                  }
                >
                  {task.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback>{getTeamMemberInitials(task.assignedTo)}</AvatarFallback>
                  </Avatar>
                  <span>{getTeamMemberName(task.assignedTo)}</span>
                </div>
                {task.dueDate && (
                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                )}
              </div>

              {/* Expanded Content */}
              {expandedTaskId === task.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-6">
                    <Notes
                      insightId={task.insightId}
                      taskId={task.id}
                      userId={selectedUserId}
                    />
                    <Timeline
                      insightId={task.insightId}
                      taskId={task.id}
                    />
                  </div>
                </div>
              )}
          </div>
        ))}
        </div>
      </div>
    </div>
  )
} 