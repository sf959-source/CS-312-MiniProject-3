CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE blogs (
    blog_id SERIAL PRIMARY KEY,
    creator_name VARCHAR(255) NOT NULL,
    creator_user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (user_id, password, name) VALUES
('sara', 'Sara123!', 'Sara'),
('maya', 'Maya123!', 'Maya'),
('alex', 'Alex123!', 'Alex');

INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES
('Sara', 'sara', 'Learning Web Development', 'I am learning how to build websites using Node.js and Express.'),
('Maya', 'maya', 'My Study Routine', 'I break large assignments into smaller tasks.'),
('Alex', 'alex', 'Why Databases Matter', 'A database stores information when an application restarts.'),
('Sara', 'sara', 'Balancing School and Work', 'I try to plan my week and make time for both.'),
('Maya', 'maya', 'Taking Study Breaks', 'Short breaks help me focus.');