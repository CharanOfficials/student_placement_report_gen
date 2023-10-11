import mongoose from "mongoose";
const subjectScoresSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required:true
    },
    subject: {
        type: String,
        enum:["DSA", "Web Development", "React"],
        required:true
    },
    scores: {
        type: Number,
        minlength: 2,
        maxlength: 2,
        required:true
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
}, {
    timestamps:true
})
const SubjectScores = mongoose.Model("subjectScores", subjectScoresSchema)
export default SubjectScores