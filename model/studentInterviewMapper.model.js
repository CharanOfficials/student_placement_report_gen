import mongoose from "mongoose";
const studentInterviewMapperSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required:true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interview',
        required:true
    },
    status: {
        type: String,
        enum: ["pass", "failed", "on_hold", "not_attempted"],
        default:"not_attempted",
        required: true
    }
}, {
    timestamps:true
})
const SIMapper = mongoose.model('studentInterviewMapper', studentInterviewMapperSchema)
export default SIMapper