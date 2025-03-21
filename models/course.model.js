// models/Doctor.js
import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
      },
    parentCourseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    duration: {
        type: String,
        required: true,
      },
    description: {
        type: String,
        required: true,
      },
    thumbnail: {
        type: String,
        required: true,
      },
    nextBatchStartDate: {
        type: Date,
        default: null,
      },
    isDemoAvailable: {
        type: Boolean,
        required: true,
      },
    difficulty : {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true,
    },
    thisCourseIsFor:{
      type:mongoose.Schema.Types.Mixed,
      required:false,
    },
    softwares:{
        type:mongoose.Schema.Types.Mixed,
        required:true,
    },
    mentors:{
            type:mongoose.Schema.Types.Mixed,
            required:true,
        },
    isClubCourse:{
        type:Boolean,
        required:true,
    },
    assignments:{
      type:mongoose.Schema.Types.Mixed,
      required:false
    },
    modules:{
        type:mongoose.Schema.Types.Mixed,
        required:false,
    },
    courseEnabled:{
        type:Boolean,
        required:true,
    },
    others:{
        type:mongoose.Schema.Types.Mixed,
        required:false,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId, 
          required:false
      }
    
}, { timestamps: true });

export const Course = mongoose.model("Course", courseSchema);
