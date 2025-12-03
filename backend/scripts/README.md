# Database Seed Scripts

## Admin User Seed Script

This script creates a test admin user for development and testing purposes.

### Usage

Run the following command from the backend directory:

```bash
npm run seed:admin
```

Or directly:

```bash
node scripts/seedAdmin.js
```

### Test Admin Credentials

After running the seed script, you can login with:

- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Role:** Admin

### Notes

- The script will delete any existing admin user with the email `admin@test.com` before creating a new one
- This is for **development and testing only** - do not use in production
- Make sure your MongoDB connection is configured in your `.env` file

