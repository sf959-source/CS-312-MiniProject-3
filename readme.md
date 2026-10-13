# CS-312 Mini Project 3

Sara's Blog uses Node.js, Express, EJS, and PostgreSQL.

Users can all sign up, sign in, and create posts. They can edit and delete their  posts. Posts are saved in PostgreSQL.

## Setup

1. Install Node.js and PostgreSQL.
2. Run `npm install` in the project folder.
3. Create a PostgreSQL database named `BlogDB`.
4. Open the Query Tool for that database in pgAdmin and run `database.sql` once.
5. Create a `.env` file in the project folder:

```text
PGHOST=localhost
PGPORT=5432
PGDATABASE=BlogDB
PGUSER=postgres
PGPASSWORD=your_postgres_password
SESSION_SECRET=your_random_secret
```

6. Replace the password and secret with your own values.
7. Run `npm start`.
8. Open http://localhost:3000.

## Sample Accounts

| User ID | Password |
| --- | --- |
| sara | Sara123! |
| maya | Maya123! |
| alex | Alex123! |

These are demonstration accounts. Passwords are stored as plain text for this class project.

## Testing

I tested everything, the signup, signin, creating posts, editing posts, and deleting posts. Duplicate user ID's and also incorrect passwords show error messages. Another account cannot open the edit page for someone else's post.