import { InsightCard as InsightCardType } from '@/types/database'

interface InsightCardProps {
  insight: InsightCardType
}

export default function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{insight.title}</h3>
        <span className="text-sm text-gray-500">{insight.confidence}% Confidence</span>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Company Value</h4>
        <p className="text-sm text-gray-600">{insight.companyValue}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Common Objections</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {insight.commonObjections.map((objection, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              {objection}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Recommended Responses</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {insight.recommendedResponses.map((response, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              {response}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Sources & References</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {insight.sourcesAndReferences.map((source, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              {source}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t">
        <span className="text-xs text-gray-500">Last updated: {insight.lastUpdated}</span>
        <button className="text-sm text-blue-500 hover:text-blue-600">
          Assign Task
        </button>
      </div>
    </div>
  )
} 