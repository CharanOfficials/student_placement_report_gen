import mongoose from "mongoose";
const studentSchema = mongoose.Schema({
    batch: {
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
        unique:true,
        minlength: 10,
        maxlength: 12,
        required:true
    },
    subjects: [{
        name: {
            type: String,
            enum:['dsa', 'webD', 'react']
        },
        scores: {
            type: Number,
            min: 70,
            max: 100
        }
    }],
    // subjectScores: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'subjectScores'
    // }],
    placement_status: {
        type: String,
        enum: ["placed", "not_placed"],
        required:true
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'inactive'],
        required:true
    },
    interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'interview'
    }],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
},{
    timestamps:true
})

// studentSchema.path('subjects').validate(function (value) {
//     return value.length <= 3;
// }, 'Subjects array cannot exceed a length of 3.');

const Student = mongoose.model('student', studentSchema)
export default Student