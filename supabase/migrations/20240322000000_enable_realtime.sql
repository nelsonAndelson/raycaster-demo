-- Enable real-time for tasks table
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Enable real-time for specific columns
COMMENT ON TABLE tasks IS 'enable_realtime'; 