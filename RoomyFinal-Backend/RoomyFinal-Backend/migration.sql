-- Migration script to add first_name and last_name columns to existing users table
-- Run this if you already have a database with the old schema

-- Add the new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Update existing users with default values (if any exist)
UPDATE users 
SET first_name = COALESCE(first_name, SPLIT_PART(username, '.', 1)),
    last_name = COALESCE(last_name, SPLIT_PART(username, '.', 2))
WHERE first_name IS NULL OR last_name IS NULL;

-- For users where last_name is empty, use first_name
UPDATE users 
SET last_name = first_name
WHERE last_name = '';

-- Add created_by column to apartments table
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS created_by INT REFERENCES users(user_id);

-- Set existing apartments to be owned by the first user who joined them
UPDATE apartments a
SET created_by = (
    SELECT r.user_id 
    FROM residence r 
    WHERE r.apartment_id = a.apartment_id 
    ORDER BY r.join_date ASC 
    LIMIT 1
)
WHERE created_by IS NULL;
