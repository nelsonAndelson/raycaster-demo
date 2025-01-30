import { NextResponse } from 'next/server'
import { createInsight } from '@/app/db/supabase'
import { ResearchCoordinator } from '@/lib/research/coordinator'
import { InsightCard } from '@/types/database'

// Type guard to validate insight data
function validateInsight(data: any): data is Omit<InsightCard, 'id'> {
  return (
    typeof data.title === 'string' &&
    typeof data.company_name === 'string' &&
    typeof data.confidence === 'number' &&
    typeof data.companyValue === 'string' &&
    Array.isArray(data.commonObjections) &&
    Array.isArray(data.recommendedResponses) &&
    Array.isArray(data.sourcesAndReferences) &&
    typeof data.lastUpdated === 'string' &&
    ['patent', 'clinical', 'market'].includes(data.category)
  )
}

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const companyUrl = data.get('companyUrl') as string
    
    if (!companyUrl) {
      return NextResponse.json(
        { error: 'Company URL is required' },
        { status: 400 }
      )
    }

    // Extract company name for the redirect
    const companyName = companyUrl.replace(/^https?:\/\//, '').split('.')[0]

    // Initialize research coordinator and analyze
    const coordinator = new ResearchCoordinator()
    const results = await coordinator.analyze(companyUrl)

    console.log('🔍 Generated research results:', {
      patent: { ...results.patent, company_name: companyName },
      clinical: { ...results.clinical, company_name: companyName },
      market: { ...results.market, company_name: companyName }
    })

    // Store all insights in Supabase with company name
    const storageResults = await Promise.allSettled([
      storeInsight('patent', { ...results.patent, company_name: companyName }),
      storeInsight('clinical', { ...results.clinical, company_name: companyName }),
      storeInsight('market', { ...results.market, company_name: companyName })
    ])

    // Log storage results
    storageResults.forEach((result, index) => {
      const category = ['patent', 'clinical', 'market'][index]
      if (result.status === 'fulfilled') {
        console.log(`✅ Successfully stored ${category} insight`)
      } else {
        console.error(`❌ Failed to store ${category} insight:`, result.reason)
      }
    })

    // Check if any insights failed to store
    const failedInsights = storageResults.filter(r => r.status === 'rejected')
    if (failedInsights.length > 0) {
      throw new Error(`Failed to store ${failedInsights.length} insights`)
    }

    // Redirect to the insights page
    return NextResponse.redirect(
      new URL(`/insights/${encodeURIComponent(companyName)}`, request.url)
    )
  } catch (error) {
    console.error("❌ Error in analyze route:", error)
    return NextResponse.json(
      { error: 'Failed to process company analysis' },
      { status: 500 }
    )
  }
}

async function storeInsight(category: string, data: any) {
  try {
    // Validate insight data
    if (!validateInsight(data)) {
      throw new Error(`Invalid ${category} insight data structure`)
    }

    // Attempt to store the insight
    const { data: result, error } = await createInsight(data)
    
    if (error) {
      throw error
    }

    return result
  } catch (error) {
    console.error(`❌ Error storing ${category} insight:`, {
      error,
      data: JSON.stringify(data, null, 2)
    })
    throw error
  }
} 