import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({


    user:{
     type:mongoose.Schema.Types.ObjectId,
     required: true,
     ref:"User"
     },
    task: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    deadline: {
        type: String,
        required: true
    }

},{
    timestamps:true
})


export default mongoose.model("todo", TodoSchema)