import mongoose from "mongoose";
const companySchema = mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    contactPersonName: {
        type: String,
        required:true
    },
    contactPersonMobile: {
        type: Number,
        required:true
    },
    interviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'interview' 
    }],
    status: {
        type: String,
        enum: ["active", "inactive"],
        required:true
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    }
}, {
    timestamps:true
})
const Company = mongoose.model('company', companySchema)
export default Company