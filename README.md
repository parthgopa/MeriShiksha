# MeriShiksha - Educational Platform

MeriShiksha is an AI-powered educational platform built with React (frontend) and Flask (backend).

## Deployment Instructions

### Frontend Deployment

1. Build the React app:
   ```
   npm run build
   ```

2. Deploy the build folder to Netlify/Vercel:
   - Connect your GitHub repository or upload the build folder
   - Configure your domain (merishiksha.com) in the hosting provider's settings
   - Set environment variables in the hosting provider's dashboard:
     - `VITE_BACKEND_URL=https://your-backend-url.onrender.com`

### Backend Deployment on Render.com

1. Create a new Web Service on Render.com
2. Connect your GitHub repository
3. Configure the following settings:
   - **Name**: merishiksha-api
   - **Runtime**: Python 3.9 (or newer)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -b 0.0.0.0:$PORT src.backhand.app:app`
   - **Environment Variables**: Add all variables from .env.production

4. After deployment, update your frontend's VITE_BACKEND_URL to point to your new Render.com URL

### MongoDB

- No need to host MongoDB separately as you're already using MongoDB Atlas
- Make sure your MongoDB Atlas IP whitelist allows connections from anywhere (0.0.0.0/0) or from Render.com's IP ranges

## Subscription System

The app includes a subscription system to limit API calls for free users with:
- AICarrierGuidance: Provides AI career guidance using Gemini API
- SubscriptionCheck: Checks if user has API calls remaining or active subscription
- ApiLimitModal: Shown when user has no API calls remaining
