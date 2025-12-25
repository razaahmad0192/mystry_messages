import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
export const runtime = "nodejs";


import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    await dbConnect();

    try {
        const { username, password, email } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken by a verified user.",
            }, { status: 400 });
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email is already registered.",
                }, { status: 400 });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
                await existingUserByEmail.save();
                const emailResponse = await sendVerificationEmail(existingUserByEmail.email, existingUserByEmail.username, existingUserByEmail.verifyCode);
                if (!emailResponse.success) {
                    return Response.json({
                        success: false,
                        message: emailResponse.message || "Failed to send verification email.",
                    }, { status: 500 });
                }
                return Response.json({
                    success: true,
                    message: "User updated successfully. Please check your email to verify your account.",
                }, { status: 201 });
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();

            const emailResponse = await sendVerificationEmail(email, username, verifyCode);
            if (!emailResponse.success) {
                return Response.json({
                    success: false,
                    message: emailResponse.message || "Failed to send verification email.",
                }, { status: 500 });
            }

            return Response.json({
                success: true,
                message: "User registered successfully. Please check your email to verify your account.",
            }, { status: 201 });
        }
    } catch (error) {
        console.error("Error signing up user:", error);
        return Response.json({
            success: false,
            message: "Internal server error during sign-up.",
        }, { status: 500 });
    }
}