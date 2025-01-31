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

export const runtime = 'edge'

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

    // Create a new TransformStream for streaming the response
    const stream = new TransformStream()
    const writer = stream.writable.getWriter()
    const encoder = new TextEncoder()

    // Start the response stream
    const response = new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

    // Process analysis in the background
    const processAnalysis = async () => {
      try {
        // Initialize research coordinator and analyze
        const coordinator = new ResearchCoordinator()
        
        // Send status update
        await writer.write(encoder.encode('data: {"status":"analyzing"}\n\n'))
        
        const results = await coordinator.analyze(companyUrl)
        
        // Send analysis results
        await writer.write(encoder.encode(`data: {"status":"storing","results":${JSON.stringify(results)}}\n\n`))

        // Store all insights in Supabase with company name
        const storageResults = await Promise.allSettled([
          storeInsight('patent', { ...results.patent, company_name: companyName }),
          storeInsight('clinical', { ...results.clinical, company_name: companyName }),
          storeInsight('market', { ...results.market, company_name: companyName })
        ])

        // Check for failed storage operations
        const failedResults = storageResults.filter(result => result.status === 'rejected')
        if (failedResults.length > 0) {
          throw new Error(`Failed to store ${failedResults.length} insights`)
        }

        // Send completion status and redirect URL
        await writer.write(encoder.encode(`data: {"status":"complete","redirect":"/insights/${encodeURIComponent(companyName)}"}\n\n`))
      } catch (err) {
        const error = err as Error
        await writer.write(encoder.encode(`data: {"status":"error","message":"${error.message}"}\n\n`))
      } finally {
        await writer.close()
      }
    }

    // Start processing without waiting
    processAnalysis()

    return response
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