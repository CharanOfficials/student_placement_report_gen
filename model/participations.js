import mongoose from "mongoose";
const allocationSchema = mongoose.Schema({
    // to whom we allocate
    allocatee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    // who allocate
    allocater: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    // who all get allocated
    allocated: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    }]
}, {
    timestamps:true
})
const Allocation = mongoose.model('allocation', allocationSchema)
export default Allocation