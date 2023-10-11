import mongoose from "mongoose";
const feedbackSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    performance: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'performance',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'deleted'],
        required: true
    },
    posted_by_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
}, {
    timestamps:true
})
const Performance = mongoose.model('feedbacks', feedbackSchema)
export default Performance