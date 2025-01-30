import { Task } from '@/types/database'

interface TeamActivityProps {
  tasks: Task[]
}

export default function TeamActivity({ tasks }: TeamActivityProps) {
  const completedTasks = tasks.filter(task => task.status === 'completed')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const pendingTasks = tasks.filter(task => task.status === 'pending')

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Team Activity</h2>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Task Progress</h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gray-900">{completedTasks.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gray-900">{inProgressTasks.length}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-semibold text-gray-900">{pendingTasks.length}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Tasks</h3>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{task.title}</h4>
                <span className={`text-xs px-2 py-1 rounded ${
                  task.status === 'completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {task.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Assigned to: {task.assignedTo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 