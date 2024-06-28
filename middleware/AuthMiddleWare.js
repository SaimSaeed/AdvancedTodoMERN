import jwt from "jsonwebtoken"
import User from "../models/User.js"


const protect = async (req, res, next) => {
    // Requesting token from headers
    const authHeader = req.headers.token
    if (authHeader && authHeader.startsWith("Bearer")) {
        try {
            // To get the token split function is used so that only token is taken as value
            const token = authHeader.split(' ')[1]
            // Verify Token
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            //Getting User from Token
            // select is used to remove password
            req.user = await User.findById(decode.id).select("-password")
            //    Calling next piece of middleware
            next()
        } catch (error) {
            console.log(error)
            res.status(401).json("Your Are Not Authorized!")
        }
    }
    if (!authHeader) {
        res.status(401).json("Not Authorized, No Token!")
    }
}


export { protect };