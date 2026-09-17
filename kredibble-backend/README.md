# Kredibble Backend

Express API built with Native MongoDB and Cloudinary.

## Setup

1. Copy `.env.example` to `.env` if not present.
2. Ensure you have a MongoDB Atlas cluster and Cloudinary account.
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`

Default API URL: `http://localhost:4000/api`

## Deployment (Render)

1. Create a new **Web Service** on Render.
2. Connect your GitHub repository.
3. Set the following:
   - **Root Directory:** `kredibble-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Your MongoDB Atlas URL)*
   - `JWT_SECRET`: *(A long random string)*
   - `ADMIN_JWT_SECRET`: *(Another long random string)*
   - `CLOUDINARY_CLOUD_NAME`: *(From Cloudinary dashboard)*
   - `CLOUDINARY_API_KEY`: *(From Cloudinary dashboard)*
   - `CLOUDINARY_API_SECRET`: *(From Cloudinary dashboard)*
   - `CORS_ORIGIN`: *(The URLs of your deployed admin/web apps, comma-separated)*

## Useful Routes

- `GET /api/health` - Health check (Use this for Render)
- `POST /api/auth/register` - User signup
- `POST /api/auth/login` - User login
- `POST /api/upload` - File upload to Cloudinary (Requires Auth)
