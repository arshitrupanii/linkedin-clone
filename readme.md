# LinkedIn Clone Backend

A scalable Node.js + Express REST API for a social networking platform.

------------------------------------------------------------------------

## ⚙️ Tech Stack

-   Node.js, Express
-   MongoDB + Mongoose
-   JWT (Auth)
-   Cloudinary (Images)
-   bcrypt, cors, morgan

------------------------------------------------------------------------

## 🔑 Core Features

-   Authentication (JWT + cookies)
-   User profile & connections
-   Posts (create, like, comment)
-   Notifications system
-   Secure & rate-limited API

------------------------------------------------------------------------

## 📁 Structure

controller/ -\> business logic\
routes/ -\> API endpoints\
model/ -\> database schema\
middleware/ -\> auth\
lib/ -\> utils (JWT, DB, etc.)

------------------------------------------------------------------------

## 🔐 Auth Flow

-   JWT stored in HTTP-only cookies\
-   Protected routes via middleware\
-   Token expiry: 7 days

------------------------------------------------------------------------

## 📡 API Overview

Base URL: `/api/v1`

-   `/auth` → signup, login, logout\
-   `/user` → profile & suggestions\
-   `/posts` → feed, like, comment\
-   `/connections` → requests & network\
-   `/notifications` → alerts

------------------------------------------------------------------------

## 🧠 Best Practices

-   Use asyncHandler for controllers\
-   Validate inputs & ObjectIds\
-   Check null before DB access\
-   Consistent response:

``` json
{ "success": true, "data": {} }
```

------------------------------------------------------------------------

## 🐛 Fixes

-   Route order fixed\
-   Null checks added\
-   Response standardized

------------------------------------------------------------------------

## 🚀 Run

    npm install
    npm run dev

------------------------------------------------------------------------

## 🎯 Goal

Production-ready scalable backend
