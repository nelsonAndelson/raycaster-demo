-- Add missing columns to tasks table
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE; 