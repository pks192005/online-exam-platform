# Exam Management Application

A comprehensive online exam management and delivery system built with modern technologies.

## Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with Passport
- **Payment**: Stripe Integration
- **Validation**: class-validator & class-transformer

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Payment UI**: Stripe React Components

### DevOps
- **Containerization**: Docker & Docker Compose
- **Database**: MongoDB 7.0

## Features

### User Roles & Permissions

1. **Free User (Unregistered)**
   - Access public home page
   - Select subject and test up to 5 questions
   - Questions stored in separate free-tier database
   - Cannot create full exams

2. **Student (Registered)**
   - Take assigned exams
   - View exam history and results
   - Access only published/active exams
   - Cannot create or edit exams

3. **Teacher (Registered)**
   - Create, edit, and delete own exams (draft status only)
   - Manage questions (add, edit, remove, reorder)
   - Publish and activate exams
   - Grade submissions (auto-grade + manual for essays)
   - View analytics for own exams
   - Bulk upload questions from CSV

4. **Admin (Registered)**
   - Full system access
   - Manage all users, exams, and questions
   - System-wide analytics
   - Override any content regardless of status

### Exam Lifecycle

1. **Create** - Draft status, editable
2. **Add Questions** - Multiple question types supported
3. **Configure Settings** - Duration, passing score, behavior options
4. **Assign Students** - Set access and schedule
5. **Publish** - Lock content (no more edits)
6. **Activate** - Make available to students
7. **Grade & Review** - Auto-grade + manual grading for essays

### Question Types

- Multiple Choice (Single/Multiple correct answers)
- True/False
- Fill-in-the-Blanks
- Essay (long-form text with manual grading)

### Payment Integration

- Stripe checkout for account upgrades
- Support for Credit Card, Debit Card, and UPI
- Automatic role update upon successful payment
- Subject selection during upgrade

## Project Structure

```
z-vsme/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── users/             # User management
│   │   ├── questions/         # Question management
│   │   ├── exams/             # Exam management
│   │   ├── submissions/       # Submission & grading
│   │   ├── payment/           # Stripe integration
│   │   └── common/            # Guards, decorators, interfaces
│   ├── .env                   # Environment variables
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utilities and API client
│   ├── .env.local             # Frontend environment variables
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Setup Instructions

### Prerequisites

- Docker Desktop (for Windows/Mac) or Docker Engine (for Linux)
- Node.js 22+ (for local development without Docker)
- npm or yarn

### Environment Variables

#### Backend (.env)

```env
MONGODB_URI=mongodb://mongodb:27017/exam-management
MONGODB_FREE_URI=mongodb://mongodb:27017/exam-management-free
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### Running with Docker (Recommended)

1. **Clone/Copy the project to your Windows machine**

2. **Update environment variables**
   - Edit `backend/.env` with your Stripe keys
   - Edit `frontend/.env.local` with your Stripe publishable key

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop services**
   ```bash
   docker-compose down
   ```

### Running Locally (Without Docker)

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### MongoDB

Install and run MongoDB locally or use MongoDB Atlas (cloud).

## API Documentation

### Authentication Endpoints

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### User Endpoints

- `GET /users` - Get all users (Admin only)
- `GET /users/me` - Get current user profile
- `GET /users/:id` - Get user by ID (Admin only)
- `PATCH /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)

### Question Endpoints

- `POST /questions` - Create question
- `POST /questions/bulk-upload` - Bulk upload from CSV
- `GET /questions` - Get all questions
- `GET /questions/subject/:subject` - Get questions by subject
- `GET /questions/:id` - Get question by ID
- `PATCH /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question

### Exam Endpoints

- `POST /exams` - Create exam
- `GET /exams` - Get all exams
- `GET /exams/:id` - Get exam by ID
- `PATCH /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam
- `POST /exams/:id/publish` - Publish exam
- `POST /exams/:id/activate` - Activate exam
- `POST /exams/:id/archive` - Archive exam
- `POST /exams/:id/questions/:questionId` - Add question to exam
- `DELETE /exams/:id/questions/:questionId` - Remove question from exam

### Submission Endpoints

- `POST /submissions/start/:examId` - Start exam
- `POST /submissions` - Submit exam
- `PATCH /submissions/:id/grade` - Grade essay answer
- `GET /submissions` - Get all submissions
- `GET /submissions/exam/:examId` - Get submissions by exam
- `GET /submissions/:id` - Get submission by ID

### Payment Endpoints

- `POST /payment/create-checkout` - Create Stripe checkout session
- `POST /payment/webhook` - Stripe webhook handler
- `GET /payment/verify-session` - Verify payment session

## CSV Format for Bulk Question Upload

```csv
text,type,subject,topic,points,correctAnswer,options
"What is 2+2?",multiple_choice,Mathematics,Arithmetic,1,,"[{""text"":""3"",""isCorrect"":false},{""text"":""4"",""isCorrect"":true}]"
"The sky is blue",true_false,Science,Nature,1,true,
"Capital of France",fill_in_blank,Geography,Europe,1,Paris,
```

## Default Admin Account

After first run, create an admin account using the registration endpoint with role set to 'admin'.

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Update the environment variables with your keys
4. For webhooks, use Stripe CLI or configure webhook endpoint in Stripe Dashboard

## Security Notes

- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS in production
- Keep Stripe keys secure
- Never commit .env files to version control

## Deployment to AWS

### Using AWS Amplify

1. Push code to GitHub
2. Connect repository to AWS Amplify
3. Configure environment variables in Amplify console
4. Deploy

### Using EC2

1. Launch EC2 instance
2. Install Docker
3. Clone repository
4. Run docker-compose up -d

### Database

- Use MongoDB Atlas for production database
- Update MONGODB_URI in environment variables

## Support

For issues or questions, refer to the documentation or create an issue in the repository.

## License

Proprietary - All rights reserved
