# LinkedIn Clone - Backend Documentation

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Routes](#api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Middleware & Utilities](#middleware--utilities)
- [Error Handling](#error-handling)
- [Recent Bug Fixes](#recent-bug-fixes)
- [Development Guidelines](#development-guidelines)

---

## Overview

The LinkedIn Clone backend is a Node.js/Express REST API that powers a social networking platform. It provides endpoints for user authentication, profile management, posts/feed, connections, and notifications.

**Key Features:**

- User authentication with JWT tokens
- User profile management with profile pictures and banners (Cloudinary)
- Create, edit, and delete posts
- Like and comment on posts
- Connection requests and management
- Real-time notifications for likes, comments, and connections

---

## Tech Stack

| Technology             | Purpose               |
| ---------------------- | --------------------- |
| **Node.js**            | JavaScript runtime    |
| **Express.js**         | Web framework         |
| **MongoDB**            | NoSQL database        |
| **Mongoose**           | MongoDB ODM           |
| **JWT**                | Authentication tokens |
| **bcryptjs**           | Password hashing      |
| **Cloudinary**         | Image storage & CDN   |
| **express-rate-limit** | Rate limiting         |
| **morgan**             | HTTP request logging  |
| **cors**               | Cross-origin requests |
| **cookie-parser**      | Cookie handling       |

---

## Project Structure

```
server/
├── controller/              # Route handlers
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── post.controller.js
│   ├── notification.controller.js
│   └── connections.controller.js
├── routes/                  # API route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── post.routes.js
│   ├── notification.routes.js
│   └── connections.routes.js
├── model/                   # Database schemas
│   ├── user.model.js
│   ├── post.model.js
│   ├── notification.model.js
│   └── connectionsRequest.model.js
├── middleware/              # Custom middleware
│   └── auth.middleware.js
├── validation/              # Input validation
│   └── auth.validation.js
├── lib/                     # Utility functions
│   ├── db.js               # MongoDB connection
│   ├── asyncHandler.js     # Error handling wrapper
│   ├── jwt.js              # Token generation
│   └── cloudinary.js       # Image upload
├── server.js               # Main server file
└── package.json
```

---

## Setup & Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Steps

1. **Clone and navigate to server folder:**

```bash
cd server
npm install
```

2. **Create `.env` file:**

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start the server:**

```bash
npm start           # Production
npm run dev        # Development with nodemon
```

The server runs on `http://localhost:3000` by default.

---

## Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/linkedin-clone

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Frontend
FRONTEND_URL=http://localhost:5173

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Logging
LOGGER_INFO=combined
```

---

## Database Models

### User Model

Stores user profile information and connections.

**Schema:**

```javascript
{
  name: String (required),
  username: String (required, unique),
  email: String (required, unique),
  password: String (hashed, required),
  profilePicture: String (Cloudinary URL),
  bannerImg: String (Cloudinary URL),
  headline: String (default: 'Linked In User'),
  Location: String (default: 'India'),
  about: String,
  skills: [String],
  experience: [{
    title: String,
    company: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  education: [{
    school: String,
    fieldofStudy: String,
    startDate: Number,
    endDate: Number
  }],
  connections: [ObjectId] (refs to User),
  timestamps: true
}
```

### Post Model

Stores user posts and comments.

**Schema:**

```javascript
{
  author: ObjectId (ref: User, required),
  content: String,
  image: String (Cloudinary URL),
  likes: [ObjectId] (refs to User),
  comments: [{
    content: String,
    user: ObjectId (ref: User),
    createdAt: Date (default: now)
  }],
  timestamps: true
}
```

### ConnectionRequest Model

Manages connection requests between users.

**Schema:**

```javascript
{
  sender: ObjectId (ref: User, required),
  recipient: ObjectId (ref: User, required),
  status: String (enum: ["pending", "accepted", "rejected"], default: "pending"),
  timestamps: true
}
```

### Notification Model

Stores user notifications for likes, comments, and connection acceptances.

**Schema:**

```javascript
{
  recipient: ObjectId (ref: User, required),
  type: String (enum: ["like", "comment", "connectionAccepted"]),
  relatedUser: ObjectId (ref: User),
  relatedPost: ObjectId (ref: Post),
  read: Boolean (default: false),
  timestamps: true
}
```

---

## API Routes

### Base URL

```
http://localhost:3000/api/v1
```

### 1. Authentication Routes (`/auth`)

| Method | Endpoint  | Auth | Description              |
| ------ | --------- | ---- | ------------------------ |
| POST   | `/signup` | ❌   | Register new user        |
| POST   | `/login`  | ❌   | Login user               |
| POST   | `/logout` | ✅   | Logout user              |
| GET    | `/me`     | ✅   | Get current user profile |

**Example Requests:**

```bash
# Signup
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}

# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

# Get Current User
GET /api/v1/auth/me
```

---

### 2. User Routes (`/user`)

| Method | Endpoint       | Auth | Description                       |
| ------ | -------------- | ---- | --------------------------------- |
| GET    | `/suggestions` | ✅   | Get suggested connections (max 3) |
| GET    | `/:username`   | ✅   | Get public profile by username    |
| PUT    | `/profile`     | ✅   | Update user profile               |

**Example Requests:**

```bash
# Get Suggestions
GET /api/v1/user/suggestions

# Get Public Profile
GET /api/v1/user/johndoe

# Update Profile
PUT /api/v1/user/profile
Content-Type: application/json

{
  "headline": "Software Engineer at XYZ",
  "about": "Passionate developer",
  "location": "San Francisco",
  "skills": ["JavaScript", "React", "Node.js"],
  "profilePicture": "data:image/jpeg;base64,...",
  "bannerImg": "data:image/jpeg;base64,..."
}
```

---

### 3. Posts Routes (`/posts`)

| Method | Endpoint       | Auth | Description                       |
| ------ | -------------- | ---- | --------------------------------- |
| GET    | `/`            | ✅   | Get feed posts (from connections) |
| POST   | `/create`      | ✅   | Create a new post                 |
| DELETE | `/delete/:id`  | ✅   | Delete post (author only)         |
| GET    | `/:id`         | ✅   | Get single post details           |
| POST   | `/:id/comment` | ✅   | Add comment to post               |
| POST   | `/:id/like`    | ✅   | Like/unlike post                  |

**Example Requests:**

```bash
# Get Feed
GET /api/v1/posts/

# Create Post
POST /api/v1/posts/create
Content-Type: application/json

{
  "content": "Just launched my new project!",
  "image": "data:image/jpeg;base64,..."
}

# Add Comment
POST /api/v1/posts/507f1f77bcf86cd799439011/comment
Content-Type: application/json

{
  "content": "Great post!"
}

# Like Post
POST /api/v1/posts/507f1f77bcf86cd799439011/like

# Delete Post
DELETE /api/v1/posts/delete/507f1f77bcf86cd799439011
```

---

### 4. Notifications Routes (`/notifications`)

| Method | Endpoint    | Auth | Description               |
| ------ | ----------- | ---- | ------------------------- |
| GET    | `/`         | ✅   | Get user's notifications  |
| PUT    | `/:id/read` | ✅   | Mark notification as read |
| DELETE | `/:id`      | ✅   | Delete notification       |

**Example Requests:**

```bash
# Get Notifications
GET /api/v1/notifications/

# Mark as Read
PUT /api/v1/notifications/507f1f77bcf86cd799439011/read

# Delete Notification
DELETE /api/v1/notifications/507f1f77bcf86cd799439011
```

---

### 5. Connections Routes (`/connections`)

| Method | Endpoint             | Auth | Description                     |
| ------ | -------------------- | ---- | ------------------------------- |
| POST   | `/request/:userId`   | ✅   | Send connection request         |
| PUT    | `/accept/:requestId` | ✅   | Accept connection request       |
| PUT    | `/reject/:requestId` | ✅   | Reject connection request       |
| GET    | `/requests`          | ✅   | Get pending connection requests |
| GET    | `/`                  | ✅   | Get user's connections          |
| DELETE | `/:userId`           | ✅   | Remove connection               |
| GET    | `/status/:userId`    | ✅   | Check connection status         |

**Example Requests:**

```bash
# Send Connection Request
POST /api/v1/connections/request/507f1f77bcf86cd799439011

# Get Pending Requests
GET /api/v1/connections/requests

# Accept Request
PUT /api/v1/connections/accept/507f1f77bcf86cd799439011

# Check Connection Status
GET /api/v1/connections/status/507f1f77bcf86cd799439011

# Get All Connections
GET /api/v1/connections/

# Remove Connection
DELETE /api/v1/connections/507f1f77bcf86cd799439011
```

---

## Authentication & Authorization

### JWT Token Strategy

1. **Token Generation** (`lib/jwt.js`):
   - Token expires in 7 days
   - Stored in HTTP-only cookie (secure in production)
   - Contains user ID in payload

2. **Protected Routes**:
   - All routes except `/auth/signup` and `/auth/login` require authentication
   - Token validated via `protectedRoute` middleware
   - User object attached to `req.user`

3. **Cookie Configuration**:
   ```javascript
   {
     httpOnly: true,           // Prevents XSS attacks
     secure: true,             // HTTPS only in production
     sameSite: 'none',         // For cross-origin requests
     maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
   }
   ```

### Authorization Checks

- **Post deletion**: Only post author can delete
- **Profile updates**: User can only update their own profile
- **Connection requests**: Cannot send to self, cannot duplicate pending requests
- **Notifications**: Users can only read/delete their own notifications

---

## Middleware & Utilities

### 1. Authentication Middleware (`middleware/auth.middleware.js`)

**`protectedRoute`**: Verifies JWT token and attaches user to request.

```javascript
// Validates token from cookies
// Returns 401 if token missing or invalid
// Fetches user from DB and attaches to req.user
```

### 2. Error Handling (`lib/asyncHandler.js`)

**`asyncHandler`**: Wraps async route handlers and catches errors.

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage:
export const getPost = asyncHandler(async (req, res) => {
  // Errors automatically caught and passed to error handler
});
```

### 3. JWT Utils (`lib/jwt.js`)

**`generateToken`**: Creates JWT and sets cookie.

```javascript
generateToken(userId, res);
// Creates 7-day token and sets secure HTTP-only cookie
```

### 4. Database Connection (`lib/db.js`)

**`connectDB`**: Establishes MongoDB connection.

```javascript
await mongoose.connect(process.env.MONGO_URI);
```

---

## Error Handling

### Global Error Handler (`server.js`)

```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  let message = err.message;

  // Hide internal errors in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong";
  }

  res.status(statusCode).json({ success: false, message });
};
```

### Standard Error Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Status Codes

| Code | Meaning           | Usage                            |
| ---- | ----------------- | -------------------------------- |
| 400  | Bad Request       | Invalid input, duplicate entries |
| 401  | Unauthorized      | Missing/invalid token            |
| 403  | Forbidden         | Not authorized for action        |
| 404  | Not Found         | Resource doesn't exist           |
| 409  | Conflict          | Duplicate username/email         |
| 429  | Too Many Requests | Rate limit exceeded              |
| 500  | Server Error      | Unexpected errors                |

---

## Recent Bug Fixes

### Version 1.0.1 - Critical Bug Fixes

Four critical bugs were identified and fixed:

#### 1. Route Order Issue (connections.routes.js)

- **Problem**: `/status/:userId` route came after `/:userId`, making it unreachable
- **Fix**: Reordered routes so `/status/:userId` is checked before parametric `/:userId`
- **Impact**: Connection status endpoint now accessible

#### 2. Null Check in likepost (post.controller.js)

- **Problem**: No null check after `Post.findById()` before accessing `post.likes`
- **Fix**: Added validation to ensure post exists before operations
- **Impact**: Prevents server crash when liking non-existent posts

#### 3. Null Check in rejectConnectionRequest (connections.controller.js)

- **Problem**: No null check after `ConnectionRequest.findById()` before accessing properties
- **Fix**: Added validation to ensure request exists
- **Impact**: Prevents server crash when rejecting invalid requests

#### 4. Response Format Inconsistencies (connections.controller.js)

- **Problem**: `getConnectionRequests` and `getUserConnections` returned raw data
- **Fix**: Wrapped responses in standard `{ success: true, data }` format
- **Impact**: Consistent API contracts across all endpoints

---

## Development Guidelines

### Adding New Features

1. **Create Model** (`server/model/`):
   - Define Mongoose schema
   - Export model

2. **Create Routes** (`server/routes/`):
   - Define endpoints
   - Add protectedRoute middleware where needed
   - Import controller functions

3. **Create Controller** (`server/controller/`):
   - Wrap with `asyncHandler`
   - Validate inputs
   - Perform DB operations
   - Return consistent response format

4. **Example**:

```javascript
// Model
const schema = new mongoose.Schema({
  /* ... */
});
export default mongoose.model("Name", schema);

// Route
router.post("/endpoint", protectedRoute, controllerFunction);

// Controller
export const controllerFunction = asyncHandler(async (req, res) => {
  const data = await Model.create(req.body);
  res.status(201).json({ success: true, data });
});
```

### Response Format Standards

**Success Response:**

```json
{
  "success": true,
  "message": "Optional message",
  "data": {
    /* ... */
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description"
}
```

### Testing

- No automated tests currently configured
- Manual testing required
- Test with Postman/Insomnia for API endpoints
- Test with frontend for integration

### Rate Limiting

- **Window**: 15 minutes
- **Limit**: 150 requests per IP
- **Response**: 429 status with "Too many requests" message

### Logging

- Request logging via Morgan middleware
- Console logs for errors and connection events
- Error stack traces logged in development

### Best Practices

1. ✅ Always use `asyncHandler` for async route handlers
2. ✅ Validate ObjectIds before DB queries
3. ✅ Check if documents exist before accessing properties
4. ✅ Return consistent response format
5. ✅ Use appropriate HTTP status codes
6. ✅ Set proper error status codes
7. ✅ Protect routes that require authentication
8. ✅ Use `findByIdAndUpdate` with `{ new: true }` for updated data
9. ✅ Populate references only when needed
10. ✅ Use `.select()` to exclude sensitive fields

### Common Issues

**Issue**: "Cannot read property 'likes' of null"

- **Cause**: Post not found before accessing properties
- **Fix**: Add null check after `findById()`

**Issue**: Route `/status/:userId` not working

- **Cause**: Route ordering - parametric route matches first
- **Fix**: Ensure literal routes come before parametric routes

**Issue**: Images not uploading

- **Cause**: Missing or invalid Cloudinary credentials
- **Fix**: Check `.env` CLOUDINARY\_\* variables

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set secure JWT_SECRET
- [ ] Use HTTPS (`secure: true` in cookies)
- [ ] Set CORS origin to production URL
- [ ] Connect to production MongoDB
- [ ] Configure Cloudinary credentials
- [ ] Enable rate limiting (already configured)
- [ ] Test all endpoints
- [ ] Monitor error logs
- [ ] Set up backup strategy

---

## Support & Troubleshooting

For issues or improvements, refer to:

- Code comments in each file
- Model schemas for data structure
- Controller functions for business logic
- Routes for endpoint definitions

**Last Updated**: 2026-04-26
**Status**: Development with recent bug fixes
