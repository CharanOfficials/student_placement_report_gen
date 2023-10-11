import mongoose from 'mongoose'
const departmentSchema = mongoose.Schema({
    dept_name: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        maxlength: 12,
        minlength: 10
    },
    positions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'position',
        required:true
    }],
    dept_status: {
        type: String,
        enum: ['active', 'inactive'],
        required:true
    }}, {
    timestamps:true
})
const Department = mongoose.model('department', departmentSchema)
export default Department