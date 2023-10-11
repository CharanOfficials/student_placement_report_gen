import mongoose from 'mongoose'
const positionSchema = mongoose.Schema({
    pos_name: {
        type: String,
        required:true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department'
    },
    pos_status: {
        type: String,
        enum: ['active', 'inactive'],
        required:true
    }
}, {
    timestamps: true
})
const Position = mongoose.model('position', positionSchema)
export default Position