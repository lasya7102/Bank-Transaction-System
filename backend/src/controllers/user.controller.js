const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Service=require('../services/email.service.js');
const tokenBlackListModel = require("../models/blackList.model");
async function registerUser(req, res) {
    const { email, password, name } = req.body;

    const isExists = await userModel.findOne({ email });

    if (isExists) {
        return res.status(422).json({
            message: "User already exists on this email",
            status: "failed"
        });
    }

    const user = await userModel.create({
        name,
        email,
        password
    });

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
    );

   res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 3 * 24 * 60 * 60 * 1000
});
   console.log("Calling sendRegistrationEmail...");
await Service.sendRegistrationEmail(user.email, user.name);
console.log("Email function completed.");
    return res.status(201).json({
        message: "Account created successfully",
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        }
    });
}

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel
        .findOne({ email })
        .select("+password");

    if (!user) {
        return res.status(401).json({
            message: "Email or Password is invalid"
        });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
        return res.status(401).json({
            message: "Email or Password is invalid"
        });
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 3 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
        message: "Login Successful"
    });
}
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}
async function getCurrentUser(req, res) {
    const user = await userModel
        .findById(req.user._id)
        .select("+systemUser");

    return res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            systemUser: user.systemUser
        }
    });
}
module.exports = { registerUser,loginUser,userLogoutController,getCurrentUser };