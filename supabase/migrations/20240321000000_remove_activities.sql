-- Drop triggers first
DROP TRIGGER IF EXISTS tasks_activity_trigger ON tasks;
DROP TRIGGER IF EXISTS notes_activity_trigger ON notes;

-- Drop the activity logging function
DROP FUNCTION IF EXISTS log_activity();

-- Drop the activities table
DROP TABLE IF EXISTS activities; 