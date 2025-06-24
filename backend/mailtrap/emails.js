import { sender, mailTrapClient } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email address",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        })

        console.log("Email sent successfully:", response);

    } catch (error) {
        throw new Error(`Failed to send verification email: ${error.message}`);
        console.log("Error sending email:", error);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];
    console.log("Sending welcome email to:", recipient);

    try {
        const response =  await mailTrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "ba8d330e-d13e-44a5-b7ef-eccbaab4741a",
            template_variables: {
                "company_info_name": "EduStats",
                "name": name
            }
        })

        console.log("Welcome email sent successfully:", response);
    } catch (error) {
        console.log("Error sending welcome email:", error);
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        });
        
        console.log("Password reset email sent successfully:", response);
    } catch (error) {
        console.log("Error sending password reset email:", error);
        throw new Error(`Failed to send password reset email: ${error.message}`);
    }
}

export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password reset successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });

    } catch (error) {
        console.log("Error sending password reset success email:", error);
        throw new Error(`Failed to send password reset success email: ${error.message}`);
    }
}