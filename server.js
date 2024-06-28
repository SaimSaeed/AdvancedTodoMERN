import express from "express"
import cors from "cors"
import todoRoutes from "./routes/todoRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database is Connected!")
})
.catch((error)=>{
    console.log(error)
})

 

const app = express()
app.use(express.json())
app.use(cors())
app.options("*",cors())
app.use("/api/todo",todoRoutes)
app.use("/api/auth",authRoutes)






const port = process.env.port || 7000
app.listen(port,()=>{
    console.log(`Server is Running! ${port}`)
})