import { getInsights, getTasks } from '@/app/db/supabase'
import InsightCard from '@/components/InsightCard'
import TeamActivity from '@/components/TeamActivity'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import TaskList from '@/components/TaskList'

interface PageProps {
  params: { company: string }
}

export default async function DashboardPage({ params }: PageProps) {
  const { data: insights } = await getInsights()
  const { data: tasks } = await getTasks()
  const companyName = decodeURIComponent(params.company)

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {companyName} Research Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Research Insights */}
          <div className="space-y-8">
            {insights?.filter(insight => insight.company_name === companyName)
              .map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
          </div>

          {/* Tasks */}
          <div className="space-y-8">
            <TaskList 
              tasks={tasks?.filter(task => task.company_name === companyName) || []}
              companyName={companyName}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 