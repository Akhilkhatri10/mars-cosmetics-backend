# 🛍️ Mars Cosmetics – Backend (MERN E-Commerce)

Backend service for **Mars Cosmetics**, a full-stack e-commerce platform supporting both **user-facing storefront** and **admin dashboard** functionalities.  
Built with **Node.js, Express, and MongoDB**, providing secure APIs for authentication, products, orders, users, and sales analytics.

---

🔗 **Frontend Repository:**  
https://github.com/your-username/mars-cosmetics-frontend

🌐 **API Base URL (Production):**  
https://your-render-backend-url/api

---

## 🚀 Features

### Core Features
- RESTful API architecture
- JWT-based authentication
- Role-based access control (Admin / User)
- Secure environment variable handling
- MongoDB aggregation for analytics

### User APIs
- User authentication (login / logout)
- Profile management
- Order history
- Secure checkout support

### Admin APIs
- Dashboard overview statistics
- Monthly sales analytics
- Product management
- Order management
- Customer management

---

## 🧑‍💻 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

---

## 📂 Project Structure

```text
src/
├─ controllers/
├─ models/
├─ routes/
├─ middlewares/
├─ config/
├─ utils/
└─ server.js

```
---
## ⚙️ Environment Variables
#### Create a .env file in the backend root:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

⚠️ **Do not commit `.env` files.**  
Use `.env.example` for reference.

--- 

## 🛠️ Local Development
### Clone the repository
```bash
git clone https://github.com/your-username/mars-cosmetics-backend
cd mars-cosmetics-backend
```
### Install dependencies
```bash
npm install
```
### Start the development server
```bash
npm run dev
```
Backend runs on: 
```bash
http://localhost:5000
```
---
## 📊 Sales Analytics Logic

- Sales data is aggregated using MongoDB aggregation pipelines

- Monthly revenue is calculated server-side

- Frontend consumes pre-processed analytics data

- Reduces frontend computation and improves 
---
## 🌍 Deployment
### Backend (Render)
- Deployed as a Web Service

- Environment variables configured via Render dashboard

- Auto-deploy enabled on push to main

- MongoDB Atlas used as database
---
## 🔒 Security Practices

- Passwords hashed using bcrypt

- JWT-based authentication & authorization

- Admin routes protected via middleware

- CORS restricted to frontend domain

- Sensitive values stored in environment variables

---

## 📌 Future Improvements

- Refresh token implementation

- Rate limiting & API throttling

- Advanced role-based permissions

- API documentation (Swagger)

- WebSocket support for real-time updates

--- 

## 👤 Author

Akhilesh Khatri  
-
MERN Stack / Frontend Developer  

- #### LinkedIn: [linkedin.com/in/your-linkedin](https://linkedin.com/in/your-linkedin)

---
## ⭐️ Show Some Love
#### If you find this project helpful, please consider giving it a ⭐️ on GitHub!
#### Your support is greatly appreciated!
#### Thank you! 😊

---

#### Thank you for checking out the Mars Cosmetics Frontend repository!
#### Happy coding! 🚀
