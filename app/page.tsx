'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Raycaster AI Research Assistant</h1>
          <p className="mt-2 text-gray-600">
            Enter a company URL to generate insights, objections, and responses
          </p>
        </div>

        <form className="mt-8 space-y-4" action="/api/analyze" method="POST">
          <div className="rounded-md shadow-sm space-y-2">
            <Input
              type="url"
              name="companyUrl"
              required
              placeholder="Enter company URL (e.g., intelliatx.com)"
              className="h-12"
            />
          </div>

          <Button type="submit" className="w-full h-12 bg-blue-500 text-white hover:bg-blue-600 hover:text-white" variant="outline">
            Generate Insights
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>Example URLs:</p>
          <ul className="mt-2 space-y-1">
            <li>intelliatx.com</li>
            <li>cariboubio.com</li>
            <li>beamtx.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
