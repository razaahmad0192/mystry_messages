import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";
import { Message } from "@/src/model/User";
import { messageSchema } from "@/src/schemas/messageSchema";

export async function POST(request: Request) {
    await dbConnect();

    const body = await request.json();
    const { username, content } = body;
    
    // Validate message content
    const validationResult = messageSchema.safeParse({ content });
    if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0]?.message || "Invalid message";
        return Response.json({
            success: false,
            message: errorMessage
        }, { status: 400 });
    }
    
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        // Is user Accepting the messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                success: false,
                message: "User is not accepting messages at the moment"
            }, { status: 403 })
        }
        const newMessage = {
            content,
            createdAt: new Date()
        }
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.error("Failed to send message", error);
        return Response.json({
            success: false,
            message: "Failed to send message"
        }, { status: 500 })
    }
}