-- Add missing columns to insights table
ALTER TABLE insights
ADD COLUMN IF NOT EXISTS common_objections JSONB,
ADD COLUMN IF NOT EXISTS recommended_responses JSONB,
ADD COLUMN IF NOT EXISTS sources_and_references JSONB,
ADD COLUMN IF NOT EXISTS active_trials INTEGER,
ADD COLUMN IF NOT EXISTS key_indications JSONB,
ADD COLUMN IF NOT EXISTS key_patent_areas JSONB,
ADD COLUMN IF NOT EXISTS market_size NUMERIC,
ADD COLUMN IF NOT EXISTS competitors JSONB,
ADD COLUMN IF NOT EXISTS patent_count INTEGER,
ADD COLUMN IF NOT EXISTS key_indications TEXT[],
ADD COLUMN IF NOT EXISTS key_patent_areas TEXT[];

-- Update existing columns to use more appropriate types if needed
ALTER TABLE insights
ALTER COLUMN company_value TYPE TEXT,
ALTER COLUMN category TYPE TEXT,
ALTER COLUMN title TYPE TEXT;

-- Add missing columns to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS category TEXT; 