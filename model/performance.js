import mongoose from "mongoose";
const performanceSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    feedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'feedbacks',
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        required: true
    },
    posted_by_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    posted_for_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
},{
    timestamps:true
})
const Performance = mongoose.model('performance', performanceSchema)
export default Performance