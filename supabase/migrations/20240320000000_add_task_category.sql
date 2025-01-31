-- Add category column to tasks table if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Update existing rows to have a default category if needed
UPDATE tasks 
SET category = 'general'
WHERE category IS NULL; 