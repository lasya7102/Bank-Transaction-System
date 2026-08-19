const express=require('express');
const router=express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const accountController=require('../controllers/account.controller.js');
router.post('/create',authMiddleware.authMiddleware,accountController.createAccount);
router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountsController)
router.get("/:accountId/balance", authMiddleware.authMiddleware, accountController.getAccountBalanceController)

module.exports=router;
