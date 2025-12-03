-- CLEAN START:


-- Drop view and functions that may depend on tables
DROP VIEW IF EXISTS rent_summary CASCADE;

DROP FUNCTION IF EXISTS calculate_split_rent(INT);
DROP FUNCTION IF EXISTS get_next_queue_payer(INT);

-- Drop legacy / old tables if they exist
DROP TABLE IF EXISTS invites CASCADE;
DROP TABLE IF EXISTS rent_queue CASCADE;

-- Drop current core tables
DROP TABLE IF EXISTS groceries CASCADE;
DROP TABLE IF EXISTS chore_assignments CASCADE;
DROP TABLE IF EXISTS chores CASCADE;
DROP TABLE IF EXISTS rent_payments CASCADE;
DROP TABLE IF EXISTS residence CASCADE;
DROP TABLE IF EXISTS apartments CASCADE;
DROP TABLE IF EXISTS users CASCADE;


-- CORE TABLES


-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    custom_status TEXT,
    bio TEXT,
    CONSTRAINT status_check CHECK (
        status IN ('AVAILABLE', 'BUSY', 'WORKING', 'CLEANING', 'AWAY', 'CUSTOM')
    )
);

-- Apartments Table
CREATE TABLE apartments (
    apartment_id SERIAL PRIMARY KEY,
    complex_name VARCHAR(100) NOT NULL,
    room_number VARCHAR(20),
    rent_amount DECIMAL(10,2),
    rent_due_day INT,
    payment_type VARCHAR(20) CHECK (payment_type IN ('SPLIT', 'QUEUE')),
    created_by INT REFERENCES users(user_id)
);

-- Residence Table (connects Users ↔ Apartments)
CREATE TABLE residence (
    residence_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    apartment_id INT REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, apartment_id)
);

-- Rent Payments Table
CREATE TABLE rent_payments (
    rent_id SERIAL PRIMARY KEY,
    apartment_id INT REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(20) CHECK (payment_type IN ('SPLIT', 'QUEUE')),
    paid_by INT REFERENCES users(user_id),
    is_paid BOOLEAN DEFAULT FALSE
);

-- Payment Queue Table (for rotating payments)
CREATE TABLE payment_queue (
    queue_id SERIAL PRIMARY KEY,
    apartment_id INT REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    queue_position INT NOT NULL,
    UNIQUE(apartment_id, user_id),
    UNIQUE(apartment_id, queue_position)
);

-- Chores Table
CREATE TABLE chores (
    chore_id SERIAL PRIMARY KEY,
    apartment_id INT REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    created_by INT REFERENCES users(user_id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_type VARCHAR(20) CHECK (recurrence_type IN ('DAILY', 'WEEKLY', 'MONTHLY')),
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE
);

-- Chore Assignments Table
CREATE TABLE chore_assignments (
    assignment_id SERIAL PRIMARY KEY,
    chore_id INT REFERENCES chores(chore_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE
);

-- Groceries Table
CREATE TABLE groceries (
    item_id SERIAL PRIMARY KEY,
    apartment_id INT REFERENCES apartments(apartment_id) ON DELETE CASCADE,
    added_by INT REFERENCES users(user_id),
    name VARCHAR(100) NOT NULL,
    quantity VARCHAR(50),
    category VARCHAR(50),
    is_purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purchased_at TIMESTAMP
);


-- FUNCTIONS


-- Split Rent Function
CREATE OR REPLACE FUNCTION calculate_split_rent(apartment_id INT)
RETURNS TABLE(user_id INT, amount_due DECIMAL(10,2)) AS $$
BEGIN
    RETURN QUERY
    SELECT
        r.user_id,
        ROUND(
            a.rent_amount / COUNT(r.user_id) OVER (PARTITION BY r.apartment_id),
            2
        ) AS amount_due
    FROM residence r
    JOIN apartments a ON r.apartment_id = a.apartment_id
    WHERE r.apartment_id = apartment_id;
END;
$$ LANGUAGE plpgsql;

-- Queue Next Payer Function
CREATE OR REPLACE FUNCTION get_next_queue_payer(apartment_id INT)
RETURNS INT AS $$
DECLARE
    next_user INT;
BEGIN
    SELECT r.user_id
    INTO next_user
    FROM residence r
    WHERE r.apartment_id = apartment_id
    ORDER BY r.join_date
    LIMIT 1 OFFSET (
        (SELECT COUNT(*) FROM rent_payments WHERE apartment_id = r.apartment_id) %
        (SELECT COUNT(*) FROM residence WHERE apartment_id = r.apartment_id)
    );

    RETURN next_user;
END;
$$ LANGUAGE plpgsql;


-- VIEW


CREATE OR REPLACE VIEW rent_summary AS
SELECT 
    a.apartment_id,
    a.complex_name,
    rp.due_date,
    rp.payment_type,
    rp.is_paid,
    u.username AS paid_by
FROM rent_payments rp
JOIN apartments a ON rp.apartment_id = a.apartment_id
LEFT JOIN users u ON rp.paid_by = u.user_id;

-- TEST DATA (OPTIONAL SEED)


-- Insert test users
INSERT INTO users (username, password, first_name, last_name, email, status)
VALUES
    ('testuser', 'password123', 'Test', 'User', 'test@example.com', 'AVAILABLE'),
    ('john', 'john123', 'John', 'Doe', 'john@example.com', 'BUSY'),
    ('jane', 'jane123', 'Jane', 'Smith', 'jane@example.com', 'WORKING')
ON CONFLICT (username) DO NOTHING;

-- Insert test apartments
INSERT INTO apartments (complex_name, room_number, rent_amount, rent_due_day)
VALUES 
    ('Sunset Apartments', '101', 2000.00, 1),
    ('Downtown Lofts', '305', 2500.00, 5)
ON CONFLICT DO NOTHING;

-- Link users to apartments
INSERT INTO residence (user_id, apartment_id)
VALUES 
    (1, 1),  -- testuser in Sunset Apartments 101
    (2, 1),  -- john in Sunset Apartments 101
    (3, 2)   -- jane in Downtown Lofts 305
ON CONFLICT (user_id, apartment_id) DO NOTHING;

-- Add test rent payment
INSERT INTO rent_payments (apartment_id, due_date, total_amount, payment_type, paid_by, is_paid)
VALUES 
    (1, CURRENT_DATE + INTERVAL '5 days', 2000.00, 'QUEUE', NULL, FALSE),
    (1, CURRENT_DATE, 2000.00, 'SPLIT', 1, TRUE)
ON CONFLICT DO NOTHING;

-- Insert test chores
INSERT INTO chores (apartment_id, created_by, title, description, is_recurring, recurrence_type, due_date, is_completed)
VALUES 
    (1, 1, 'Take out trash', 'Take trash to dumpster', TRUE, 'DAILY', CURRENT_DATE, FALSE),
    (1, 2, 'Clean kitchen', 'Wipe counters and do dishes', FALSE, NULL, CURRENT_DATE + INTERVAL '2 days', FALSE),
    (2, 3, 'Vacuum living room', 'Vacuum entire living room', TRUE, 'MONTHLY', CURRENT_DATE + INTERVAL '7 days', FALSE)
ON CONFLICT DO NOTHING;

-- Assign chores to users
INSERT INTO chore_assignments (chore_id, user_id)
VALUES 
    (1, 1),  -- testuser assigned to trash
    (2, 2),  -- john assigned to kitchen
    (3, 3)   -- jane assigned to vacuum
ON CONFLICT DO NOTHING;

-- Insert some sample groceries
INSERT INTO groceries (apartment_id, added_by, name, quantity, category)
VALUES
    (1, 1, 'Milk', '1 gallon', 'Dairy'),
    (1, 2, 'Eggs', '1 dozen', 'Dairy'),
    (2, 3, 'Rice', '5 lbs bag', 'Grains');
