const {Router}=require('express');
const transactionController=require('../controllers/transaction.controller');
const authMiddleware=require('../middlewares/auth.middleware.js')
const transactionRoutes = Router();
transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)




transactionRoutes.post("/system/initial-funds", authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)
transactionRoutes.get(
    "/",
    authMiddleware.authMiddleware,
    transactionController.getTransactions
);
module.exports = transactionRoutes;