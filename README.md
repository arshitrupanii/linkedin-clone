## LinkedIn Clone

A full-stack LinkedIn-style social networking application with separate **frontend** and **backend** services.

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS / Tailwind / Styled Components (based on project setup)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## Features

- User registration and login
- Secure authentication with token-based auth
- Profile creation and updates
- Create, view, and interact with posts
- Feed/home timeline
- Responsive UI

## Project Structure

```bash
linkedin-clone/
├── frontend/   # Client application
└── backend/    # API server
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
