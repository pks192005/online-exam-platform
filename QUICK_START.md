# Quick Start Guide

## For Windows Users

### Step 1: Install Docker Desktop

1. Download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install and start Docker Desktop
3. Ensure Docker is running (check system tray icon)

### Step 2: Get Stripe API Keys

1. Go to https://stripe.com and create an account
2. Navigate to Developers → API Keys
3. Copy your "Publishable key" (starts with `pk_test_`)
4. Copy your "Secret key" (starts with `sk_test_`)

### Step 3: Configure Environment Variables

1. Open `backend\.env` in a text editor
2. Replace `sk_test_your_stripe_secret_key` with your actual Stripe secret key
3. Save the file

4. Open `frontend\.env.local` in a text editor
5. Replace `pk_test_your_stripe_publishable_key` with your actual Stripe publishable key
6. Save the file

### Step 4: Start the Application

1. Open Command Prompt or PowerShell
2. Navigate to the project directory:
   ```cmd
   cd D:\zproject\z-vsme
   ```
3. Start all services:
   ```cmd
   docker-compose up -d
   ```
4. Wait for all containers to start (about 1-2 minutes)

### Step 5: Access the Application

Open your web browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

### Step 6: Create Your First Account

1. Click "Register" on the home page
2. Fill in your details
3. Select account type (Student, Teacher, or Free User)
4. Click "Create Account"
5. You'll be automatically logged in

### Step 7: Create an Admin Account (Optional)

To create an admin account, use an API client like Postman:

```
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin"
}
```

## Common Commands

### View Logs
```cmd
docker-compose logs -f
```

### Stop the Application
```cmd
docker-compose down
```

### Restart the Application
```cmd
docker-compose restart
```

### Rebuild After Code Changes
```cmd
docker-compose up -d --build
```

### Access MongoDB
```cmd
docker exec -it exam-mongodb mongosh
```

## Testing the API

### Register a User
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "teacher"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create a Question (requires token)
```bash
curl -X POST http://localhost:3001/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "What is 2+2?",
    "type": "multiple_choice",
    "subject": "Mathematics",
    "points": 1,
    "options": [
      {"text": "3", "isCorrect": false},
      {"text": "4", "isCorrect": true},
      {"text": "5", "isCorrect": false}
    ]
  }'
```

## Troubleshooting

### Docker not starting
- Ensure Docker Desktop is running
- Check if ports 3000, 3001, and 27017 are not in use
- Try restarting Docker Desktop

### Cannot connect to MongoDB
- Wait a few seconds after starting docker-compose
- Check logs: `docker-compose logs mongodb`

### Frontend not loading
- Check if backend is running: http://localhost:3001
- Check browser console for errors
- Verify .env.local file exists

### Backend errors
- Check logs: `docker-compose logs backend`
- Verify .env file has correct values
- Ensure MongoDB is running

## Next Steps

1. Explore the home page at http://localhost:3000
2. Try the free trial (no registration needed)
3. Register as a teacher to create exams
4. Register as a student to take exams
5. Test the payment flow with Stripe test cards

## Stripe Test Cards

Use these test cards for payment testing:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0027 6000 3184

Use any future expiry date and any 3-digit CVC.

## Support

For issues or questions:
1. Check the logs: `docker-compose logs -f`
2. Review the README.md for detailed documentation
3. Check the PROJECT_SUMMARY.md for architecture details
