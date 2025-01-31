-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Notes table for comments and discussions
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    insight_id UUID REFERENCES insights(id),
    task_id UUID REFERENCES tasks(id),
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities table for timeline events
CREATE TABLE IF NOT EXISTS activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type TEXT NOT NULL, -- 'note_added', 'task_updated', etc.
    content JSONB NOT NULL, -- Flexible structure for different activity types
    insight_id UUID REFERENCES insights(id),
    task_id UUID REFERENCES tasks(id),
    user_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for activity logging
CREATE OR REPLACE FUNCTION log_activity() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO activities (type, content, insight_id, task_id, user_id)
    VALUES (
        TG_ARGV[0],
        row_to_json(NEW),
        NEW.insight_id,
        NEW.task_id,
        NEW.user_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for notes
CREATE TRIGGER notes_activity_trigger
    AFTER INSERT ON notes
    FOR EACH ROW
    EXECUTE FUNCTION log_activity('note_added');

-- Create triggers for tasks
CREATE TRIGGER tasks_activity_trigger
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION log_activity('task_updated'); 