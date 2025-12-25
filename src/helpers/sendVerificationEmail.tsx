import { Resend } from "resend";
import { ApiResponse } from "../types/ApiResponse";

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

        // Create plain HTML content
        const htmlContent = `
            <html>
                <body>
                    <p>Hello ${username},</p>
                    <p>Your verification code is: <strong>${verifyCode}</strong></p>
                    <p>Please use this code to complete your verification process.</p>
                    <br/>
                    <p>Regards,<br/>Mystry Messages Team</p>
                </body>
            </html>
        `;

        const response = await resend.emails.send({
            from: 'No Reply <no-reply@sialschool.space>',
            to: toEmail,
            subject: 'Verification Code',
            html: htmlContent, // Use plain HTML instead of React component
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

    } catch (error: any) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: `Failed to send verification email: ${error?.message || 'Unknown error'}`,
        };
    }
}
