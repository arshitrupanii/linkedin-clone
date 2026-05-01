## LinkedIn Clone

A full-stack LinkedIn-style social networking application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features user authentication, connection requests, posts, notifications, and image uploads via Cloudinary.

## Tech Stack

### Frontend

- **React 18** — UI framework
- **React Router** — Client-side routing
- **React Query** — Server state management
- **Axios** — HTTP client
- **Tailwind CSS + DaisyUI** — Styling
- **Vite** — Build tool

### Backend

- **Node.js + Express.js** — Server framework
- **MongoDB + Mongoose** — Database & ODM
- **JWT** — Token-based authentication
- **Cloudinary** — Image/media management
- **Cookie Parser + CORS** — Request handling

## Features

### Authentication & User Profile

- User registration and secure login with bcryptjs
- JWT-based token authentication
- Profile creation with avatar, bio, work experience, education, and skills
- Profile updates and photo management via Cloudinary

### Social Features

- **Posts** — Create, read, update, delete posts with image support
- **Connections** — Send/receive/accept connection requests (LinkedIn-style networking)
- **Notifications** — Real-time notifications for posts, connections, and interactions
- **Feed** — Personalized feed showing posts from network

### UI/UX

- Responsive design optimized for desktop and mobile
- Sidebar navigation
- Recommended users suggestions
- Clean, intuitive interface with DaisyUI components

## Project Structure

```
linkedin-clone/
├── backend/
│   ├── controllers/         # Business logic (auth, user, post, connection, notification)
│   ├── models/              # MongoDB schemas (user, post, connectionRequest, notification)
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & request middleware
│   ├── lib/                 # Utilities (database, Cloudinary setup)
│   └── server.js            # Express app entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Axios config & utilities
│   │   ├── utils/           # Helper functions
│   │   └── main.jsx         # React entry point
│   ├── package.json
│   └── vite.config.js
│
└── package.json             # Root scripts
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB URI (local or Atlas)
- Cloudinary account (for image uploads)

### 1) Clone & Install

```bash
git clone <your-repo-url>
cd linkedin-clone
npm install
```

### 2) Setup Backend Environment

Create a `.env` file in the `backend/` folder:

```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_super_secret_key_here

# Cloudinary (for image uploads)
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Server
PORT=5000
NODE_ENV=development

```

### 4) Run Development

**Terminal 1 — Backend:**

```bash
npm run dev
```

Server runs on `http://localhost:5000`

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

App runs on `http://localhost:5173`

## API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication (`/auth`)

- `POST /auth/register` — Register new user
- `POST /auth/login` — Login user
- `POST /auth/logout` — Logout user

### Users (`/users`)

- `GET /users/:id` — Get user profile
- `PUT /users/:id` — Update user profile
- `GET /users/suggested` — Get suggested connections

### Posts (`/posts`)

- `GET /posts` — Get feed posts
- `POST /posts` — Create new post
- `GET /posts/:id` — Get single post
- `PUT /posts/:id` — Update post
- `DELETE /posts/:id` — Delete post
- `POST /posts/:id/like` — Like/unlike post
- `POST /posts/:id/comment` — Add comment

### Connections (`/connections`)

- `POST /connections/request/:id` — Send connection request
- `GET /connections/requests` — Get pending requests
- `PUT /connections/requests/:id/accept` — Accept request
- `PUT /connections/requests/:id/reject` — Reject request
- `GET /connections` — Get user's connections

### Notifications (`/notifications`)

- `GET /notifications` — Get all notifications
- `PUT /notifications/:id/read` — Mark as read
- `DELETE /notifications/:id` — Delete notification

## Scripts

### Root

- `npm run build` — Install deps & build frontend for production
- `npm install` — Install backend dependencies

### Backend

- `npm run dev` — Start backend in development mode (with nodemon)
- `npm start` — Start backend in production mode

### Frontend

- `npm run dev` — Start Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint

## Deployment

### Backend (Render/Railway/Heroku)

1. Set environment variables (MONGO*URI, JWT_SECRET, CLOUDINARY*\*, PORT, etc.)
2. Run: `npm run build` (installs frontend deps and builds frontend)
3. Start: `npm start`

### Frontend

- Alternatively, deploy frontend separately to Vercel/Netlify
- Point API URL to deployed backend

## Contributing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is for learning purposes. Add your preferred license if needed.
