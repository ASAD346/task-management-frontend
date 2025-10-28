# Fix Vercel Backend Error - Environment Variables

Your backend is throwing an error because it needs environment variables. Here's how to fix it:

## Step 1: Go to Vercel Dashboard

1. Visit [vercel.com](https://vercel.com) and login
2. Click on your project: `task-management-backend` (or whatever you named it)
3. Go to **Settings** → **Environment Variables**

## Step 2: Add Required Environment Variables

Add these two environment variables:

### 1. MongoDB URI
- **Key**: `MONGODB_URI`
- **Value**: Your MongoDB Atlas connection string
  - If you don't have one, create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  - Get connection string from Atlas dashboard
  - Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanagement?retryWrites=true&w=majority`
  - Make sure to replace `<username>` and `<password>` with your actual credentials

### 2. JWT Secret
- **Key**: `JWT_SECRET`
- **Value**: A random secret key (can be any random string)
  - Generate one using: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
  - Or use any random string like: `my-super-secret-jwt-key-12345`

## Step 3: Redeploy

After adding the environment variables:
1. Go to the **Deployments** tab
2. Click the **three dots (⋯)** on your latest deployment
3. Click **Redeploy**
4. Wait for the deployment to complete

## Step 4: Test

After redeployment, test your backend:
- Visit: https://task-management-backend-1-tau.vercel.app/
- You should see: `{"message":"Task Management API is running"}`

## Step 5: Create Initial Admin

Once the backend is working, you need to create an admin user. You can do this by:

1. Using Postman or any API client
2. Making a POST request to: `https://task-management-backend-1-tau.vercel.app/api/auth/create-admin`

With this body:
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

3. Or you can do it directly from the frontend after login is working

## Troubleshooting

### Still getting errors?
- Make sure MongoDB Atlas allows connections from anywhere (IP whitelist: `0.0.0.0/0`)
- Double-check the MongoDB URI has no spaces or special characters that need encoding
- Make sure you clicked "Redeploy" after adding environment variables

