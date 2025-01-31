import { getInsights, getTasks } from '@/app/db/supabase'
import InsightCard from '@/components/InsightCard'
import TaskList from '@/components/TaskList'

interface PageProps {
  params: Promise<{ company: string }>
}

export default async function DashboardPage({
  params,
}: PageProps) {
  // First await the params
  const { company } = await params
  
  // Then decode the company name
  const companyName = decodeURIComponent(company)
  
  // Fetch data
  const { data: insights } = await getInsights()
  const { data: tasks } = await getTasks()

  console.log('All tasks:', tasks) // Debug log

  // Filter insights for this company
  const companyInsights = insights?.filter(insight => 
    insight.companyName.toLowerCase() === companyName.toLowerCase()
  ) || []

  console.log('Company insights:', companyInsights) // Debug log

  // Filter tasks for this company's insights
  const companyInsightIds = new Set(companyInsights.map(insight => insight.id))
  const companyTasks = tasks?.filter(task => 
    companyInsightIds.has(task.insightId)
  ) || []

  console.log('Filtered tasks:', companyTasks) // Debug log

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {companyName} Research Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Showing {companyTasks.length} tasks for {companyInsights.length} insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Research Insights */}
          <div className="space-y-8">
            {companyInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>

          {/* Tasks */}
          <div className="space-y-8">
            <TaskList 
              tasks={companyTasks}
              companyName={companyName}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 