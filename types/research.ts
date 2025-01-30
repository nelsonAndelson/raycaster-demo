export interface ResearchOutput {
  patent: PatentInsight;
  clinical: ClinicalInsight;
  market: MarketInsight;
}

export interface BaseInsight {
  title: string;
  confidence: number;
  companyValue: string;
  commonObjections: string[];
  recommendedResponses: string[];
  sourcesAndReferences: string[];
  lastUpdated: string;
}

export interface PatentInsight extends BaseInsight {
  category: 'patent';
  patentCount?: number;
  keyPatentAreas?: string[];
}

export interface ClinicalInsight extends BaseInsight {
  category: 'clinical';
  activeTrials?: number;
  keyIndications?: string[];
}

export interface MarketInsight extends BaseInsight {
  category: 'market';
  marketSize?: number;
  competitors?: string[];
}

export interface ChainConfig {
  searchParams: {
    query_template: string;
    sources?: string[];
  };
  promptTemplate: string;
} 