import { Task } from '@/types/research'

interface TaskListProps {
  tasks: Task[]
  companyName: string
}

export default function TaskList({ tasks, companyName }: TaskListProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Research Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border-b pb-4">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-600">{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 