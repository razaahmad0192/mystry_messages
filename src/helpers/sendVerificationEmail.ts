import { Resend } from "resend";
import { ApiResponse } from "../types/ApiResponse";
import React from "react";

import VerificationEmail from "@/src/emails/VerificationEmail";

if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not defined");
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
    toEmail: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("Sending verification email to:", toEmail);
        const response = await resend.emails.send({
            from: 'No Reply <no-reply@sialschool.space>',
            to: toEmail,
            subject: 'Verification Code',
            react: React.createElement(VerificationEmail, { username, otp: verifyCode }),
        });
        
        // Check if the response contains an error
        if (response.error) {
            console.error("Resend API error:", response.error);
            return {
                success: false,
                message: `Failed to send verification email: ${response.error.message || 'Unknown error'}`,
            };
        }
        
        console.log("Verification email sent successfully. Email ID:", response.data?.id);
        return {
            success: true,
            message: "Verification email sent successfully.",
        };

    } catch (error) {
        console.error("Error sending verification email:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            message: `Failed to send verification email: ${errorMessage}`,
        };
    }
}
