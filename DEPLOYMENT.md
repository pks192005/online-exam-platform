# Deployment Documentation

## 🚀 Your Exam Management Application is Live!

### Deployment URLs

- **Frontend (AWS)**: https://exam-management-app-288pf54o.devinapps.com
- **Backend API (Fly.io)**: https://exam-backend.fly.dev
- **GitHub Repository**: https://github.com/pks192005/online-exam-platform

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js Static Export)                       │
│  Hosted on: AWS (Devin Apps)                            │
│  URL: exam-management-app-288pf54o.devinapps.com        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend API (NestJS)                                   │
│  Hosted on: Fly.io (Singapore Region)                  │
│  URL: exam-backend.fly.dev                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                               │
│  Cluster: cluster0.snekwjd.mongodb.net                  │
│  Databases: exam-management, exam-management-free       │
└─────────────────────────────────────────────────────────┘
```

## 📋 What's Deployed

### Backend Features
✅ Complete REST API with all endpoints
✅ JWT Authentication & Authorization
✅ 4 User Roles (Free, Student, Teacher, Admin)
✅ Question Management (MCQ, True/False, Fill-in-Blank, Essay)
✅ Exam Lifecycle Management
✅ Auto-grading System
✅ Stripe Payment Integration (ready for your keys)
✅ CSV Bulk Upload for Questions
✅ Separate Database for Free Users (5 question limit)

### Frontend Features
✅ Beautiful Landing Page
✅ Login & Registration Pages
✅ Authentication Context
✅ API Client with Token Management
✅ Role-based Routing
✅ Responsive Design with Tailwind CSS

## 🔧 Configuration

### Environment Variables

**Backend (Already Set in Fly.io)**
- `MONGODB_URI`: Connected to your MongoDB Atlas cluster
- `MONGODB_FREE_URI`: Connected to free-tier database
- `JWT_SECRET`: Set to production secret
- `NODE_ENV`: production
- `FRONTEND_URL`: Set to allow all origins

**Frontend (Already Built)**
- `NEXT_PUBLIC_API_URL`: https://exam-backend.fly.dev
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Needs your Stripe key

### Stripe Integration

To enable payments, you need to:

1. **Get Stripe Keys**
   - Go to https://dashboard.stripe.com/apikeys
   - Copy your Publishable Key and Secret Key

2. **Update Backend**
   ```bash
   flyctl secrets set STRIPE_SECRET_KEY="sk_live_your_key" STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
   ```

3. **Update Frontend**
   - Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
   - Rebuild and redeploy: `npm run build` then redeploy

## 🧪 Testing the Application

### Test Backend API
```bash
# Health check
curl https://exam-backend.fly.dev/

# Register a new user
curl -X POST https://exam-backend.fly.dev/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'

# Login
curl -X POST https://exam-backend.fly.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend
1. Visit: https://exam-management-app-288pf54o.devinapps.com
2. Click "Get Started" or "Sign In"
3. Register a new account
4. Login and explore

## 📊 Monitoring & Logs

### Backend Logs (Fly.io)
```bash
# View recent logs
flyctl logs -a exam-backend

# Stream live logs
flyctl logs -a exam-backend -f
```

### Backend Status
```bash
# Check app status
flyctl status -a exam-backend

# View app info
flyctl info -a exam-backend
```

### Database Monitoring
- MongoDB Atlas Dashboard: https://cloud.mongodb.com/
- Monitor connections, queries, and performance

## 🔄 Updating the Application

### Update Backend
```bash
cd ~/z-vsme/backend

# Make your changes
# ...

# Rebuild
npm run build

# Deploy
flyctl deploy
```

### Update Frontend
```bash
cd ~/z-vsme/frontend

# Make your changes
# ...

# Rebuild
npm run build

# The static files will be in the 'out' directory
# Redeploy using your deployment tool
```

## 💰 Cost Breakdown

### Current Setup (Free/Low Cost)
- **MongoDB Atlas**: Free tier (512 MB storage)
- **Fly.io Backend**: Free tier (3 shared-cpu-1x machines with 256MB RAM each)
- **AWS Frontend**: Hosted on Devin Apps platform

### Scaling Considerations
When you need to scale:
- **MongoDB Atlas**: Upgrade to M10+ cluster ($57/month)
- **Fly.io**: Add more machines or upgrade to dedicated CPU
- **Frontend**: Move to AWS Amplify or S3 + CloudFront

## 🔐 Security Notes

### Current Security Measures
✅ HTTPS enabled on both frontend and backend
✅ JWT token-based authentication
✅ Password hashing with bcrypt
✅ CORS configured
✅ Environment variables for secrets
✅ MongoDB connection string secured

### Recommended Next Steps
1. **Change JWT Secret**: Update to a strong random secret
2. **Add Stripe Keys**: Add your production Stripe keys
3. **Configure CORS**: Restrict to your frontend domain only
4. **Enable Rate Limiting**: Add rate limiting to prevent abuse
5. **Set up Monitoring**: Add error tracking (e.g., Sentry)
6. **Backup Database**: Set up automated MongoDB backups

## 📝 Next Steps for Development

### Immediate Tasks
1. ✅ Test user registration and login
2. ✅ Verify MongoDB connections
3. ⏳ Add Stripe keys for payment testing
4. ⏳ Build remaining frontend pages:
   - Student Dashboard
   - Teacher Dashboard
   - Admin Dashboard
   - Exam Taking Interface
   - Grading Interface
   - Analytics Pages

### Future Enhancements
- Email verification for new users
- Password reset functionality
- Real-time exam monitoring
- Advanced analytics and reporting
- Mobile app (React Native)
- Bulk user import
- Integration with LMS platforms

## 🆘 Troubleshooting

### Backend Not Responding
```bash
# Check if app is running
flyctl status -a exam-backend

# Restart the app
flyctl apps restart exam-backend

# View logs for errors
flyctl logs -a exam-backend
```

### Frontend Not Loading
- Check browser console for errors
- Verify API URL is correct
- Check CORS settings in backend

### Database Connection Issues
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check connection string is correct
- Verify database user has proper permissions

## 📞 Support

- **Fly.io Docs**: https://fly.io/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **NestJS Docs**: https://docs.nestjs.com/
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

**Deployment Date**: October 23, 2025
**Deployed By**: Devin AI
**Status**: ✅ Live and Operational
