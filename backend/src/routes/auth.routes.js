const express=require('express');
const router=express.Router();
const authController=require('../controllers/user.controller.js');
const authMiddleware = require("../middlewares/auth.middleware");
router.post("/logout", authController.userLogoutController)
router.post('/register',authController.registerUser);
router.post('/login',authController.loginUser);
router.get("/me", authMiddleware.authMiddleware, authController.getCurrentUser);
module.exports=router;
