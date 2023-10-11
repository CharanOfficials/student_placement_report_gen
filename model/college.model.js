import mongoose from "mongoose";
const collegeSchema = mongoose.Schema({
    name: {
        type: String,
        unique:true,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    contact: {
        type: Number,
        minlength: 10,
        maxlength: 12,
        required:true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required:true
    }
})
const College = mongoose.model('college', collegeSchema)
export default College