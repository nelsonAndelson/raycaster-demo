import { NextResponse } from 'next/server'
import { createInsight } from '@/app/db/supabase'
import { ResearchCoordinator } from '@/lib/research/coordinator'
import { Database } from '@/types/database'

type InsightInsert = Database['public']['Tables']['insights']['Insert']

// Define interface for incoming data format (camelCase)
interface InsightInput {
  title: string;
  company_name: string;
  confidence: number;
  companyValue?: string;
  category: 'patent' | 'clinical' | 'market';
  commonObjections?: string[];
  recommendedResponses?: string[];
  sourcesAndReferences?: string[];
  activeTrials?: number;
  keyIndications?: string[];
  keyPatentAreas?: string[];
  marketSize?: number;
  competitors?: string[];
  patentCount?: number;
  lastUpdated?: string;
}

// Type guard to validate insight data
function validateInsight(data: Partial<InsightInsert>): data is InsightInsert {
  return (
    typeof data.title === 'string' &&
    typeof data.company_name === 'string' &&
    typeof data.confidence === 'number' &&
    typeof data.company_value === 'string' &&
    typeof data.category === 'string' &&
    (!data.common_objections || Array.isArray(data.common_objections)) &&
    (!data.recommended_responses || Array.isArray(data.recommended_responses)) &&
    (!data.sources_and_references || Array.isArray(data.sources_and_references)) &&
    (!data.active_trials || typeof data.active_trials === 'number') &&
    (!data.key_indications || Array.isArray(data.key_indications)) &&
    (!data.key_patent_areas || Array.isArray(data.key_patent_areas)) &&
    (!data.market_size || typeof data.market_size === 'number') &&
    (!data.competitors || Array.isArray(data.competitors)) &&
    (!data.patent_count || typeof data.patent_count === 'number') &&
    typeof data.last_updated === 'string' &&
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

async function storeInsight(category: 'patent' | 'clinical' | 'market', data: InsightInput) {
  try {
    // Transform data to match database schema
    const transformedData = {
      ...data,
      company_value: data.companyValue,
      common_objections: data.commonObjections,
      recommended_responses: data.recommendedResponses,
      sources_and_references: data.sourcesAndReferences,
      active_trials: data.activeTrials,
      key_indications: data.keyIndications,
      key_patent_areas: data.keyPatentAreas,
      market_size: data.marketSize,
      last_updated: data.lastUpdated,
      patent_count: data.patentCount
    }

    // Remove the camelCase fields
    delete transformedData.companyValue;
    delete transformedData.commonObjections;
    delete transformedData.recommendedResponses;
    delete transformedData.sourcesAndReferences;
    delete transformedData.activeTrials;
    delete transformedData.keyIndications;
    delete transformedData.keyPatentAreas;
    delete transformedData.marketSize;
    delete transformedData.lastUpdated;
    delete transformedData.patentCount;

    // Validate insight data
    if (!validateInsight(transformedData)) {
      throw new Error(`Invalid ${category} insight data structure`)
    }

    // Attempt to store the insight
    const { data: result, error } = await createInsight(transformedData)
    
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