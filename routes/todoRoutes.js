import express from "express"
import Todo from "../models/Todo.js"
import User from "../models/User.js"
import { protect } from "../middleware/AuthMiddleWare.js"
const router = express.Router()


router.get("/",protect, async(req,res)=>{
    try {
        const getTodo = await  Todo.find({user:req.user.id})
       return  res.status(200).json(getTodo)
    } catch (error) {
      return  res.status(500).json(error)
    }
})
router.get("/find/:id",protect, async(req,res)=>{
    try {
        const getTodoItem = await  Todo.findById(req.params.id)
       return  res.status(200).json(getTodoItem)
    } catch (error) {
       return res.status(500).json(error)
    }
})
router.post("/addTodo",protect, async(req,res)=>{
    try {
        const addTodo = await  Todo.create({
            user:req.user.id,
            task:req.body.task,
            status:req.body.status,
            deadline:req.body.deadline,

        })
       return  res.status(200).json(addTodo)
    } catch (error) {
       return  res.status(500).json(error)
    }
})
router.post("/updateTodo/:id",protect, async (req, res) => {
    try {

        const todo = await Todo.findById(req.params.id)
        if(!todo){
         res.status(401).json("Todo Not Found!")
         return;
        }
        const user = await User.findById(req.user.id)
        if(!user){
            res.status(401).json("User Not Found!")
            return;
        }
        // Making sure user is authorized
        if(todo.user.toString() !== user.id){
              res.status(401).json("User Not Authorized!")
              return;
        }
        const id = req.params.id
        const updateData = {
            task: req.body.task,
            status: req.body.status,
            deadline: req.body.deadline
        }
        const updateTodo = await Todo.findByIdAndUpdate(id, updateData)
        return res.status(200).json(updateTodo);
    } catch (error) {

        return res.status(500).json(error)
    }
})
router.delete("/deleteTodo/:id",protect, async (req, res) => {
    try {
        // const id = req.params.id;
        const todo = await Todo.findById(req.params.id)
        if(!todo){
            res.status(401).json("Todo Not Found!")
            return;
        }
        const user = await User.findById(req.user.id)
        if(!user){
            res.status(401).json("User Not Found!")
            return
        }
        if(todo.user.toString() !== user.id){
              res.status(401).json("User Not Authorized!")
              return
        }
        const deleteTodo = await Todo.findByIdAndDelete(req.params.id)
        return  res.status(200).json(deleteTodo);

    } catch (error) {
       return res.status(500).json(error)
    }
})











 export default router;