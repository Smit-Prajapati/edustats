import mongoose from "mongoose";
import { Roles } from "../constants/roles.js";

const teacherSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    role: {
        type: String,
        enum: [Roles.TEACHER],
        default: Roles.TEACHER
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "School",
        required: true
    }
    // assignedClass: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Class",
    //     default: null
    // }
}, { timestamps: true });

export const Teacher = mongoose.model("Teacher", teacherSchema);
