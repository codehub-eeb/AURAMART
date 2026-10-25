# 🛍️ AURAMART — Full-Stack E-Commerce Website

AURAMART is a full-stack e-commerce web application designed to provide a smooth online shopping experience. Users can browse products, manage their shopping cart, log in to their accounts, and place orders using Cash on Delivery (COD).

## 🌐 Live Demo

**Live Website:** https://auramart-nine.vercel.app/

**Backend API:** https://auramart-backend-y8bl.onrender.com

## ✨ Features

- User registration and login
- Browse available products
- Shopping cart management
- Checkout with Cash on Delivery (COD)
- Order placement and order history
- Database integration
- Responsive shopping interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- MongoDB Atlas

### Deployment
- Vercel — Frontend hosting
- Render — Backend hosting

## 🏗️ Application Architecture

React Frontend → Express.js REST API → MongoDB Database

## 🚀 Run Locally

### Frontend Setup

Clone the repository:

```bash
git clone https://github.com/codehub-eeb/AURAMART.git
cd AURAMART
npm install
```

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the development server:

```bash
npm run dev
```

### Backend Setup

Clone the backend repository:

```bash
git clone https://github.com/codehub-eeb/auramart-backend.git
cd auramart-backend
npm install
```

Create a `.env` file with your own local configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend using:

```bash
npm run dev
```

Make sure MongoDB is configured and the required environment variables are set before running the backend.

## 🔐 Security

- Keep credentials and secrets in environment variables.
- Never commit `.env` files or database credentials to GitHub.

## 👨‍💻 Project

A full-stack e-commerce project built using React, Node.js, Express.js, and MongoDB.

---

**AURAMART — Your Online Shopping Experience.**
