import { PatentResearchChain } from "./patentChain";
import { ClinicalResearchChain } from "./clinicalChain";
import { MarketResearchChain } from "./marketChain";
import { ResearchOutput } from "@/types/research";

export class ResearchCoordinator {
  private patentChain: PatentResearchChain;
  private clinicalChain: ClinicalResearchChain;
  private marketChain: MarketResearchChain;

  constructor() {
    this.patentChain = new PatentResearchChain();
    this.clinicalChain = new ClinicalResearchChain();
    this.marketChain = new MarketResearchChain();
  }

  async analyze(companyUrl: string): Promise<ResearchOutput> {
    // Extract company name from URL
    const companyName = companyUrl
      .replace(/^https?:\/\//, '')
      .split('.')[0]
      .replace(/-/g, ' ');

    try {
      // Run all chains in parallel
      const [patent, clinical, market] = await Promise.all([
        this.patentChain.analyze(companyName),
        this.clinicalChain.analyze(companyName),
        this.marketChain.analyze(companyName),
      ]);

      return {
        patent,
        clinical,
        market,
      };
    } catch (error) {
      console.error("Error in research coordinator:", error);
      throw new Error(
        `Failed to analyze company ${companyName}: ${(error as Error).message}`
      );
    }
  }
} 