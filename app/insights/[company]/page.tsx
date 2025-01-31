import { getInsights, getTasks } from '@/app/db/supabase'
import InsightCard from '@/components/InsightCard'
import TaskList from '@/components/TaskList'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { InsightCard as InsightType } from '@/types/database'

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
  const companyInsights = insights?.filter((insight: InsightType) => 
    insight.companyName.toLowerCase() === companyName.toLowerCase()
  ) || []

  console.log('Company insights:', companyInsights) // Debug log

  // Filter tasks for this company's insights
  const companyInsightIds = new Set(companyInsights.map((insight: InsightType) => insight.id))
  const companyTasks = tasks?.filter(task => 
    companyInsightIds.has(task.insightId)
  ) || []

  console.log('Filtered tasks:', companyTasks) // Debug log

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {companyName} Research Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Showing {companyTasks.length} tasks for {companyInsights.length} insights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Research Insights */}
          <div className="space-y-8">
            {companyInsights.map((insight: InsightType) => (
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