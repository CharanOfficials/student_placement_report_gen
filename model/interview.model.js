import mongoose from "mongoose";
const interviewSchema = mongoose.Schema({
    profileName: {
        type: String,
        required:true
    },
    profileDescription: {
        type: String,
        required:true
    },
    date: {
        type: Date,
        required:true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    }],
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required:true
    },
    rounds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interviewRounds',
        required:true
    }],
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        required:true
    }
}, {
    timestamps:true
})
const Interview = mongoose.model('interview', interviewSchema)
export default Interview