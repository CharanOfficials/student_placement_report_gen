import mongoose from 'mongoose'
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        maxlength:25
    },
    last_name:{
        type: String,
        maxlength:25,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim:true
    },
    password: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    account_type: {
        type: String,
        enum: ['admin', 'employee'],
        required:true
    },
    contact_no: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 12,
        unique:true
    },
    employee_id: {
        type: String,
        unique:true,
        required: true,
        maxlength: 18
    },
    date_of_birth: {
        type: Date,
        required:true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required:true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department',
        required:true
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'position',
        required:true
    },
    highest_qualification:{
        type: String,
        required: true,
    },
    performances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'performance',
        required:true
    }],
    status: {
        type: String,
        enum: ['active', 'suspended', 'inactive'],
        required:true
    }
},{
    timestamps:true
})
const User = mongoose.model('user', userSchema)
export default User