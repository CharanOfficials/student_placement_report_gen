import mongoose from "mongoose";
const studentSchema = mongoose.Schema({
    batchno: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'batch',
        required: true
    },
    name: {
        type: String,
        required:true
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "college",
        required:true
    },
    contact: {
        type: Number,
        minlength: 10,
        maxlength: 12,
        required:true
    },
    subjectScores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjectScores'
    }],
    status: {
        type: String,
        enum: ['active', 'suspended', 'inactive'],
        required:true
    },
    interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'interview'
    }]

},{
    timestamps:true
})

studentSchema.path('subjects').validate(function (value) {
    return value.length <= 3;
}, 'Subjects array cannot exceed a length of 3.');

const Student = mongoose.model('student', studentSchema)
export default Student