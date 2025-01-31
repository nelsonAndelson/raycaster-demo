'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [status, setStatus] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setStatus('Starting analysis...')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response stream available')
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')

        // Process each line
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5))
              
              switch (data.status) {
                case 'analyzing':
                  setStatus('Analyzing company data...')
                  break
                case 'storing':
                  setStatus('Storing analysis results...')
                  break
                case 'complete':
                  setStatus('Analysis complete!')
                  router.push(data.redirect)
                  break
                case 'error':
                  throw new Error(data.message)
              }
            } catch (e) {
              console.error('Error parsing stream data:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setStatus('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Raycaster AI Research Assistant</h1>
          <p className="mt-2 text-gray-600">
            Enter a company URL to generate insights, objections, and responses
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-2">
            <Input
              type="url"
              name="companyUrl"
              required
              placeholder="Enter company URL (e.g., intelliatx.com)"
              className="h-12"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {status}
              </>
            ) : (
              'Generate Insights'
            )}
          </Button>

          {status && !isLoading && (
            <p className="text-sm text-center text-gray-500">{status}</p>
          )}
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
