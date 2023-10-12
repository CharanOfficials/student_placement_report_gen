import mongoose from "mongoose";
const batchSchema = mongoose.Schema({
    batchName: {
        type: String,
        required: true
    },
    batchNo: {
        type: String,
        required:true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required:true
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
},{
    timestamps:true
})
const Batch = mongoose.model('batch', batchSchema)
export default Batch