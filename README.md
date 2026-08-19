# 🏦 Bank Transaction System — Full Stack Banking Application

A full-stack banking transaction management system built to simulate secure digital banking operations.

The application provides authentication, account management, balance tracking, money transfers, transaction history, and system-level fund management through a React frontend and Node.js/Express backend.

The project demonstrates how a real-world financial application can be structured using a modern full-stack architecture.

## ✨ Features

### 👤 Authentication

* User registration
* User login
* JWT-based authentication
* Cookie-based authentication
* Protected routes
* Authentication middleware
* Secure password handling

### 🏦 Account Management

* Create bank accounts
* View user accounts
* Track account balances
* Associate accounts with authenticated users

### 💸 Money Transfer

Users can transfer money between accounts.

The transaction system handles:

* Sender account
* Receiver account
* Transfer amount
* Transaction status
* Transaction identification
* Idempotency support

### 📊 Transaction Management

Transactions can have different states:

```text
PENDING
COMPLETED
FAILED
REVERSED
```

This allows the application to represent realistic transaction processing.

### 📒 Ledger System

The application maintains ledger entries for financial operations.

Ledger entries support:

```text
CREDIT
DEBIT
```

This provides a foundation for tracking account movements and calculating balances.

### ⚙️ System User

The backend supports a special system-user concept for system-level financial operations such as initializing account funds.

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* Vite
* Axios
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Cookie Parser
* CORS

### Database

* MongoDB Atlas

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

## 📁 Project Structure

```text
Bank-Transaction-System/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.jsx
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Install the following:

* Node.js
* npm
* Git
* MongoDB Atlas account

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Bank-Transaction-System
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Add any additional environment variables required by the backend.

Start the backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd Frontend
npm install
```

Create:

```text
.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

## 🔄 Application Architecture

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Frontend  │
                    └────────┬────────┘
                             │
                       HTTP / REST API
                             │
                             ▼
                    ┌─────────────────┐
                    │ Express Backend │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Authentication   Accounts      Transactions
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                    ┌─────────────────┐
                    │  MongoDB Atlas  │
                    └─────────────────┘
```

## 💰 Transaction Flow

A typical transfer follows this flow:

```text
User logs in
    ↓
JWT authentication
    ↓
Select sender account
    ↓
Select receiver account
    ↓
Enter transfer amount
    ↓
Backend validates request
    ↓
Transaction created
    ↓
Ledger entries generated
    ↓
Transaction completed
    ↓
Updated transaction history
```

## 🗃️ Core Data Models

### User

Stores authentication and user information.

### Account

Represents a bank account belonging to a user.

### Transaction

Stores transfer information such as:

* From account
* To account
* Amount
* Status
* Idempotency key

### Ledger

Records account-level financial movements:

* CREDIT
* DEBIT
* Amount
* Related transaction

## 🔐 Security

The project implements security practices including:

* JWT authentication
* Password hashing
* Protected API routes
* Authentication middleware
* Cookie-based authentication
* Request validation
* CORS configuration
* Environment variables for secrets
* Idempotency keys for transaction requests

## 🌐 Deployment

### Backend — Render

Configure the backend service using the `Backend` directory.

Typical settings:

```text
Root Directory: Backend
Build Command: npm install
Start Command: npm start
```

Configure environment variables in Render.

### Frontend — Vercel

Configure:

```text
Root Directory: Frontend
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

Set the production backend URL:

```env
VITE_API_BASE_URL=https://your-backend-url/api
```

## 🧪 Running in Development

Start the backend:

```bash
cd Backend
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd Frontend
npm install
npm run dev
```

Then open the frontend URL provided by Vite.

## 🔮 Future Improvements

Potential improvements include:

* Email notifications
* OTP-based authentication
* Two-factor authentication
* Scheduled transfers
* Bank statements
* PDF transaction statements
* Admin dashboard
* Transaction analytics
* Spending insights
* Account freeze/unfreeze
* Improved fraud detection
* Rate limiting
* Audit logs

## 👩‍💻 Author

**Lasya**

B.Tech Computer Science & Engineering Student

GitHub: https://github.com/lasya7102

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.
