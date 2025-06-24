import { School } from '../models/school.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateVerificationToken } from '../utils/generateVerificationToken.js';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { generateShoolUsername } from '../utils/generateUsernames.js';

import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/emails.js';

export const registerSchool = async (req, res) => {
    const { email, password, name, address, principal } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("Email, password, and name are required");
        }

        // Check if the school already exists
        const existingSchool = await School.findOne({ email });

        if (existingSchool) {
            return res.status(400).json({ success: false, message: "School already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const verificationToken = generateVerificationToken();

        const {username, schoolIndex} = await generateShoolUsername();

        const school = new School({
            email,
            password: hashedPassword,
            name,
            address,
            principal,
            username,
            schoolIndex,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // Token valid for 24 hours
        });

        await school.save();

        // jwt
        generateTokenAndSetCookie(res, school);

        // Send verification email
        // sendVerificationEmail(school.email, verificationToken);

        //send response
        res.status(201).json({
            success: true,
            message: "School registered successfully",
            school: {
                ...school._doc,
                password: undefined,
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.body;

    try {
        const school = await School.findOne({
            verificationToken,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!school) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification token" });
        }

        school.isVerified = true;
        school.verificationToken = undefined;
        school.verificationTokenExpiresAt = undefined;

        await school.save();
        // await sendWelcomeEmail(school.email, school.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            school: {
                ...school._doc,
                password: undefined,
            }
        });
    } catch (error) {
        console.log("Error during email verification:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const loginSchool = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const school = await School.findOne({ email });

        if (!school) {
            return res.status(404).json({ success: false, message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, school.password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, school);

        res.status(200).json({
            success: true,
            message: "Login successful",
            school: {
                ...school._doc,
                password: undefined,
            }
        });

    } catch (error) {
        console.log("Error during school login:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const school = await School.findOne({ email });

        if (!school) {
            return res.status(404).json({ success: false, message: "School not found" });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // Token valid for 1 hour

        school.resetPasswordToken = resetToken;
        school.resetPasswordExpiresAt = resetTokenExpiresAt;

        await school.save();

        //send email
        // await sendPasswordResetEmail(school.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        })

    } catch (error) {
        console.log("Error during forgot password:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const school = await School.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        console.log(school);

        if (!school) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token" });
        }

        //update password
        const hashedPassword = await bcrypt.hash(password, 10);

        school.password = hashedPassword;
        school.resetPasswordToken = undefined;
        school.resetPasswordExpiresAt = undefined;
        await school.save();

        // await sendResetSuccessEmail(school.email);

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log("Error during password reset:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const school = await School.findById(req.user.id).select('-password -verificationToken -verificationTokenExpiresAt -resetPasswordToken -resetPasswordExpiresAt');
        console.log("Authenticated school:", school);
        if(!school) {
            return res.status(404).json({ success: false, message: "School not found" });
        }

        res.status(200).json({
            success: true,
            school,
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const registerTeacher = async (req, res) => {
    
}

export const loginTeacher = async (req, res) => {
}

export const registerStudent = async (req, res) => {
}

export const loginStudent = async (req, res) => {
}

export const logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}