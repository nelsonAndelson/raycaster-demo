import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { MarketInsight } from "@/types/research";

const MARKET_SEARCH_TEMPLATE = `
Find market and business information for {company_name}. 
Focus on:
- Target market size and growth potential
- Key competitors and market positioning
- Recent business developments and partnerships
- Revenue projections and market opportunities
- Pricing strategies and reimbursement landscape
`;

const MARKET_ANALYSIS_TEMPLATE = `
You are an expert market analyst specializing in biotechnology and pharmaceuticals. 
Analyze the following market research data and provide insights in a structured format.
Company being analyzed: {company_name}

Research data:
{research_data}

Provide analysis in the following JSON format matching this TypeScript type:

{{
  title: string;
  confidence: number; // 0-100 based on data reliability
  category: 'market';
  companyValue: string; // 1-2 sentences on market opportunity
  commonObjections: string[]; // 2-4 key objections
  recommendedResponses: string[]; // 2-4 responses matching objections
  sourcesAndReferences: string[]; // Sources used
  marketSize?: number; // Market size in billions USD if available
  competitors?: string[]; // Key competitors
  lastUpdated: string; // Current date
}}

Ensure the output is valid JSON and includes all required fields.
`;

export class MarketResearchChain {
  private model: ChatOpenAI;
  private searchTool: TavilySearchResults;

  private cleanJsonOutput(output: string): string {
    // Remove markdown code blocks if present
    const jsonMatch = output.match(/```(?:json)?\s*([\s\S]*?)```/);
    return jsonMatch ? jsonMatch[1].trim() : output.trim();
  }

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4-turbo-preview",
      temperature: 0.7,
    });
    this.searchTool = new TavilySearchResults({
      apiKey: process.env.TAVILY_API_KEY!,
    });
  }

  async analyze(companyName: string): Promise<MarketInsight> {
    try {
      console.log('🔍 Starting market analysis for:', companyName);
      
      // Format the search query
      const searchQuery = await PromptTemplate.fromTemplate(MARKET_SEARCH_TEMPLATE)
        .format({ company_name: companyName });
      console.log('📝 Formatted search query:', searchQuery);

      // Get search results directly
      const searchResults = await this.searchTool.invoke(searchQuery);
      console.log('🔎 Raw search results:', {
        type: typeof searchResults,
        length: Array.isArray(searchResults) ? searchResults.length : 'N/A',
        preview: JSON.stringify(searchResults).slice(0, 200) + '...'
      });

      // Create and run the analysis chain
      const analysisChain = RunnableSequence.from([
        PromptTemplate.fromTemplate(MARKET_ANALYSIS_TEMPLATE),
        this.model,
        new StringOutputParser(),
        (output) => {
          console.log('🤖 Raw model output:', {
            type: typeof output,
            length: output.length,
            preview: output.slice(0, 200) + '...'
          });
          try {
            const cleanedOutput = this.cleanJsonOutput(output);
            console.log('🧹 Cleaned output:', cleanedOutput.slice(0, 200) + '...');
            return JSON.parse(cleanedOutput) as MarketInsight;
          } catch (error) {
            const parseError = error as Error;
            console.error('❌ JSON Parse Error:', {
              error: parseError.message,
              outputStart: output.slice(0, 50),
              outputEnd: output.slice(-50)
            });
            throw parseError;
          }
        },
      ]);

      console.log('⚡ Invoking analysis chain...');
      const analysis = await analysisChain.invoke({
        company_name: companyName,
        research_data: searchResults,
      });
      console.log('✅ Analysis complete:', {
        type: typeof analysis,
        preview: JSON.stringify(analysis, null, 2).slice(0, 200) + '...'
      });

      return analysis;
    } catch (error) {
      console.error("❌ Error in market research chain:", error);
      throw error;
    }
  }
} 
