import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String
    },
    isPreviewFree:{
        type:Boolean
    },
    isLive: {
        type: Boolean,
        default: false
    },
    liveStartTime: {
        type: Date
    },
    liveRoomId: {
        type: String
    }
},{timestamps:true})


const Lecture = mongoose.model("Lecture" , lectureSchema)

export default Lecture