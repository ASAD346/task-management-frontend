# Backend Setup Instructions

## Step 1: Get Your Vercel Deployment URL

Your backend is deployed on Vercel. You need to get the URL from your Vercel dashboard.

1. Go to [vercel.com](https://vercel.com)
2. Login to your account
3. Find your `task-management-backend` project
4. Copy the deployment URL (looks like: `https://your-project-name.vercel.app`)

## Step 2: Create Environment File

Create a file named `.env` in the `frontend` folder with the following content:

```
REACT_APP_API_URL=https://your-project-name.vercel.app/api
```

Replace `your-project-name.vercel.app` with your actual Vercel deployment URL.

**Note:** Make sure to add `/api` at the end of the URL.

## Step 3: Install Dependencies and Run

```bash
cd frontend
npm install
npm start
```

## Backend Endpoints

Your backend has these endpoints:

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/create-admin` - Create initial admin
- `GET /api/auth/me` - Get current user

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get task statistics
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `POST /api/users/managers` - Create manager (Admin only)
- `GET /api/users/managers` - Get all managers (Admin only)
- `POST /api/users/regular-users` - Create regular user (Admin/Manager)
- `GET /api/users/regular-users` - Get all regular users
- `PUT /api/users/assign-manager` - Assign manager to user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Troubleshooting

### Issue: Cannot connect to backend
- Check that your `.env` file is in the `frontend` folder
- Make sure the URL includes `/api` at the end
- Restart your frontend server after creating/editing `.env`

### Issue: CORS errors
- Your backend already has CORS enabled
- Make sure you're using the correct backend URL

