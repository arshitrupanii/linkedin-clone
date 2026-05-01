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

### 1) Clone the repository

```bash
git clone <your-repo-url>
cd linkedin-clone
```

### 2) Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

Run backend:

```bash
npm run dev
```

### 3) Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` (if required):

```env
REACT_APP_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm start
```

## API Overview

Typical backend route groups:

- `/api/auth` - login/register
- `/api/users` - user/profile operations
- `/api/posts` - post CRUD and feed

## Scripts

### Backend

- `npm run dev` - Start backend in development mode
- `npm start` - Start backend in production mode

### Frontend

- `npm start` - Start development server
- `npm run build` - Create production build

## Deployment

- Deploy backend to Render/Railway/Heroku/VPS
- Deploy frontend to Vercel/Netlify
- Set production environment variables for both services

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is for learning purposes. Add your preferred license if needed.
