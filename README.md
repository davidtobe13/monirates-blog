# Blog Project

This project is a **full-stack blog application** built with:
- **Frontend**: Next.js (React) with React Query, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Charts**: Chart.js with React-chartjs-2 for analytics

## Features
- User authentication (login/register)
- Create, edit, and delete blog posts
- View analytics for post creation & tag usage
- Secure API with JWT authentication

---

## 📌 Server Setup (Node.js + Express + MongoDB)

### Prerequisites
- **Node.js** installed (v14+ recommended)
- **MongoDB** (Local or Atlas)

### 1️⃣ Install Dependencies
Clone the repository and navigate to the `server` folder:

```sh
cd server
npm install
```

### 2️⃣ Create a `.env` File
Create a `.env` file in the `server` folder with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 3️⃣ Start the Server
Run the following command:

```sh
npm run dev
```

The server will run on **http://localhost:5000**.

---

## 📌 Client Setup (Next.js + React Query)

### Prerequisites
- **Node.js** installed

### 1️⃣ Install Dependencies
Navigate to the `client` folder and install dependencies:

```sh
cd client
npm install
```

### 2️⃣ Configure Environment Variables
Create a `.env.local` file in the `client` folder:

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
```

### 3️⃣ Start the Client
Run the following command:

```sh
npm run dev
```

The client will run on **http://localhost:3000**.

---

## 📌 API Endpoints

### Authentication
- `POST /api/auth/register` → Register a user
- `POST /api/auth/login` → Login and receive a JWT token

### Posts
- `POST /api/posts` → Create a post (Authenticated)
- `GET /api/posts` → Get all posts
- `GET /api/posts/:id` → Get a single post
- `PUT /api/posts/:id` → Update a post (Authenticated)
- `DELETE /api/posts/:id` → Delete a post (Authenticated)

### Analytics
- `GET /api/analytics` → Get analytics data for the logged-in user

---

## 📌 Authentication (JWT)
1. After login, the token is stored in cookies.
2. Every authenticated request must include the token in the `Authorization` header:
   ```sh
   Authorization: Bearer your_jwt_token
   ```

---

