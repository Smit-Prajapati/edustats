import mongoose from 'mongoose';
import { Roles } from '../constants/roles.js';

const schoolSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [Roles.PRINCIPAL], // restricting to PRINCIPAL for school model
        default: Roles.PRINCIPAL,
    },
    schoolIndex: {
        type: Number,
        unique: true,
        required: true
    },
    address: {
        type: String
    },
    principal: {
        name: String,
        phone: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

export const School = mongoose.model('School', schoolSchema);