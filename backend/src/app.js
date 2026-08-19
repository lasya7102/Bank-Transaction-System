const express=require('express');
const cookieParser=require("cookie-parser");
const app=express();
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
app.use(cors({
     origin: [
      "http://localhost:5173",
      "https://ledger-bank-chi.vercel.app"
    ],
    credentials: true
}));
const authRouter=require('./routes/auth.routes');
const accountRouter=require('./routes/account.routes');
const transactionRoutes=require('./routes/transaction.routes');
app.use('/api/auth',authRouter)
app.use('/api/accounts',accountRouter);
app.use('/api/transactions',transactionRoutes);

//Deploy using render and github
//Sign in to postman and test







module.exports=app;



