import mongoose from "mongoose";
const interviewRoundScheduleSchema = mongoose.Schema({
    scheduled_on: {
        type: Date,
        required:true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interview',
        required:true
    },
    round_name: {
        type: String,
        enum: ["Technical 1", "Technical 2", "HR", "Resume Shortlisting"],
        required:true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
},{
    timeStamps:true
})
const interviewRounds = mongoose.model('interviewRounds', interviewRoundScheduleSchema)
export default interviewRounds