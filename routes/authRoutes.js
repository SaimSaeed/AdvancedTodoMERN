import express from "express";
import User from "../models/User.js";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import { protect } from "../middleware/AuthMiddleWare.js";
dotenv.config();
const router = express.Router()




router.post("/register", async (req, res) => {
    try {
        const {username,email,password} = req.body
        const hashedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString()
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })
       return res.status(201).json(user)

    } catch (error) {
      return  res.status(500).json(error)
    }

})


// Private
router.get("/me",protect, async (req, res) => {
    // try {
    //     const saveUser = await User.findById(req.params.id)
    //     res.status(200).json(saveUser)

    // } catch (error) {
    //     res.status(500).json(error)
    // }
    // we should be able to get user id from middleware we we accessed user throught token
    const {_id,username,email} = await User.findById(req.user.id)
     return res.status(200).json({
        id:_id,
        username,
        email
    })

})




router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        })
        if (!user) {
            res.status(401).json("User Not Found!")
            return;
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);;
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8)
        if (originalPassword !== req.body.password) {
            res.status(401).json("Wrong Credentials!")
            return;
        }

        const { password, ...others } = user._doc

      return   res.status(200).json({...others,token:generateToken(user._id)})

    } catch (error) {
      return   res.status(500).json(error)
    }

})



const generateToken = (id)=>{
    return jwt.sign({
        id}, process.env.JWT_SECRET,
        { expiresIn: "4d" }
    )
}











export default router